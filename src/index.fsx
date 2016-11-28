(**
 - title: Fable behaviors sample
 - tagline: fun with behaviors
 - app-style: width:1024px; margin:20px auto 50px auto;
 - require-paths: `'PIXI':'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/3.0.11/pixi.min'`
 - intro: Just a try to implement the Fable architecture over Pixi. This is an experimentation for the moment
*)

#r "../node_modules/fable-core/Fable.Core.dll"
#r "../node_modules/fable-powerpack/Fable.PowerPack.dll"
#load "../node_modules/fable-import-fetch/Fable.Import.Fetch.fs"
#load "../node_modules/fable-import-fetch/Fable.Helpers.Fetch.fs"
#load "../node_modules/fable-import-pixi/Fable.Import.Pixi.fs"
#load "Easing.fsx"

open System
open System.Collections.Generic
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import.PIXI
open Fable.Import.PIXI.extras
open Fable.Import
open Fable.PowerPack
open Fable.Import.Fetch
open Fable.Helpers.Fetch

// Types -------------------------------------------


// For performance, we use delegates instead of curried F# functions
type Behavior = Func<ESprite, float, JS.Promise<bool>>

and ESprite(t:Texture, id: string, behaviors: Behavior list) =
    inherit Sprite(t)
    let mutable _behaviors = behaviors
    let mutable _disposed = false
    let mutable _prevTime = 0.

    member __.Id = id
    member __.IsDisposed = _disposed

    member self.Behave(b:Behavior) =
        _behaviors <- b :: _behaviors

    // Use a promise computation expression to iterate
    // through the behaviors as if they were synchronous
    member self.Update(dt: float) = promise {
        let behaviors = _behaviors
        _behaviors <- []
        let mutable notCompletedBehaviors = []
        let dt =
            let tmp = _prevTime
            _prevTime <- dt
            if tmp = 0. then 0. else dt - tmp
        for b in behaviors do
            let! complete = b.Invoke(self, dt)
            if not complete then
                notCompletedBehaviors <- b::notCompletedBehaviors
        // Some behaviors may have been added in the meanwhile with Behave
        _behaviors <- _behaviors @ notCompletedBehaviors
    }

    // System.IDisposable is the usual interface for disposable objects
    // in C#/F#. It lets you use language constructs like `use`.
    interface IDisposable with
        member self.Dispose() =
            if not _disposed then
                _disposed <- true
                self.parent.removeChild(self) |> ignore


//
and State =
  | Nothing 
  | Loading 
  | Play 
  | MainTitle
  | NextDate

type CodeFrequency = {
  timestamp:float;
  addition:float;
  deletion:float;
}

type Launcher = {
  plus:float;
  minus:float;
}

type Trail = {
  sprite:Sprite;
  dec:float;
}

type Easing = Func<float, float, float, float, float>

// Behaviors -------------------------------------------
module Behaviors =
    let private distanceBetween2Points (p1:Point) (p2:Point) =
        let tx = p2.x - p1.x
        let ty = p2.y - p1.y
        JS.Math.sqrt( tx * tx + ty * ty)
    let fade(easeFunction: Easing, duration) =
        let mutable ms = 0.
        Behavior(fun s dt ->
            if s.alpha > 0.
            then
                ms <- ms + dt
                let result = easeFunction.Invoke(ms, 0., 1., duration)
                s.alpha <- 1. - result
                if s.alpha < 0.
                then s.alpha <- 0.; true
                else false
            else true
            |> Promise.lift)
    let fadeOut(easeFunction: Easing, duration, onCompleted) =
        let mutable ms = 0.
        Behavior(fun s dt ->
            if s.alpha <1.
            then
              ms <- ms + dt
              let result = easeFunction.Invoke(ms, 0., 1., duration)
              s.alpha <- result
              false
            else 
              if s.alpha > 1. then s.alpha <- 1.
              onCompleted s
              true
          |> Promise.lift)
    let curveTo(easeFunction: Easing, duration, radius, p:Point, onCompleted) =
        let mutable ms = -1.
        let mutable distance = 0.
        let mutable a = 0.
        let where = if JS.Math.random() > 0.5 then 1. else -1.
        let curve = JS.Math.random() * 5. / 500. * where
        Behavior(fun s dt ->
          let vx,vy = (p.x - s.position.x, p.y - s.position.y)
          a <- JS.Math.atan2(vy,vx) + curve
          if ms < 0. 
          then
            let vx,vy = (p.x - s.position.x, p.y - s.position.y)
            distance <- JS.Math.sqrt(vx * vx + vy * vy)
            ms <- 0.
            false
          else 
            ms <- ms + dt
            let result = easeFunction.Invoke(ms, 0., 1., duration)
            let d = JS.Math.abs(distance) * ( 1. - result)
            if result < 1. || d > radius then
              let factor = if distance > 0. then -1. else 1.
              s.rotation <- a
              s.position <- Point( p.x + d * JS.Math.cos(a) * factor, p.y + d * JS.Math.sin(a) * factor)
              false
            else 
              onCompleted s
              true
        |> Promise.lift)          
    let breathe(amplitude, speed) = 
      let mutable scale = Point(0.,0.)
      let mutable ms = -1.      
      let mutable a = 0.
      Behavior(fun s _ ->
        if ms < 0. 
        then
          scale <- Point( s.scale.x, s.scale.y )
          ms <- 0.
        else
          a <- a + speed
          s.scale.x <- scale.x + JS.Math.cos(a) * amplitude
          s.scale.y <- scale.y + JS.Math.cos(a) * amplitude
        false 
      |> Promise.lift)
    let alphaDeath(onCompleted) = Behavior(fun s _ ->
        if s.alpha <= 0.
        then (s :> IDisposable).Dispose(); onCompleted s; true
        else false
        |> Promise.lift)
    let killOffScreen(bounds: Rectangle, onCompleted) = Behavior(fun s _ ->
        let sx = s.position.x
        let sy = s.position.y
        let offScreen =
            (sx + s.width) < bounds.x
            || (sy + s.height) < bounds.y
            || (s.y - s.height) >= bounds.height
            || (sx - s.width) > bounds.width
        if offScreen then
            onCompleted s
            (s :> IDisposable).Dispose()
        Promise.lift offScreen)

    let grow(easeFunction: Easing, duration, max, min) =
        let mutable ms = -1.
        let mutable scale = max
        let diff = max - min        
        Behavior(fun s dt ->
          ms <- ms + dt
          let result = easeFunction.Invoke(ms, 0., 1., duration)
          scale <- min + (result*diff)
          if scale >= max 
          then true
          else 
            s.scale <- Point(scale, scale)
            false
        |> Promise.lift)          
    

// Animation ------------------------------------------------
open Behaviors

let updateLoop(renderer:WebGLRenderer) (stage:Container) =
  let centerX = renderer.width * 0.5
  let centerY = renderer.height * 0.5
  let rwidth = renderer.width
  let rheight = renderer.height
  let maxParticlesByCodeFrequency = 300.
  let fps = 60.
  let maxParticlesByFrame = maxParticlesByCodeFrequency / fps

  let mutable id = -1
  let mutable state : State = Loading
  let mutable resources  = Unchecked.defaultof<loaders.ResourceDictionary>
  let mutable launchers : Launcher list = []
  let mutable sprites : ESprite list = []
  let mutable ghData : CodeFrequency list = []
  let mutable trails : Trail list = []  
  let mutable rocketsGreen : Sprite [] = [||]
  let mutable rocketsYellow : Sprite [] = [||]
  let mutable sum : float = 0.
  let mutable plusSum : float = 0.
  let mutable minusSum : float = 0.

  // sprites
  let mutable planet = Unchecked.defaultof<Sprite>
  let mutable title = Unchecked.defaultof<Sprite>
  let mutable subtitle = Unchecked.defaultof<Sprite>
  let mutable minusBand = Unchecked.defaultof<Sprite>
  let mutable plusBand = Unchecked.defaultof<Sprite>
  let mutable maskPlus = Unchecked.defaultof<Graphics>
  let mutable maskMinus = Unchecked.defaultof<Graphics>
  let mutable textPlus = Unchecked.defaultof<BitmapText>
  let mutable textMinus = Unchecked.defaultof<BitmapText>

  // prepare our containers  
  let createParticleContainer max = 
    let options : ParticleContainerProperties list = [
                ParticleContainerProperties.Scale true
                ParticleContainerProperties.Rotation true
                ParticleContainerProperties.Alpha true
              ]
    ParticleContainer(max, options)

  let backgroundContainer = Container()
  let yellowContainer = createParticleContainer 500000.
  let minusContainer = createParticleContainer 50000.
  let planetContainer = Container()
  let greenContainer = createParticleContainer 500000.
  let plusContainer = createParticleContainer 500000.
  // add our containers to the stage
  let bindContainer (c:DisplayObject) = stage.addChild c |> ignore 
  [|
      backgroundContainer
      ;unbox yellowContainer // ParticleContainer is not a Container
      ;unbox minusContainer // ParticleContainer is not a Container
      ;unbox greenContainer // ParticleContainer is not a Container
      ;unbox plusContainer // ParticleContainer is not a Container
      ;planetContainer
  |]
    |> Seq.iter bindContainer

  // sprite & ESprite helper functions
  let nextId() = 
    id <- id + 1
    sprintf "%i" id    
  let makeSprite t = 
    Sprite t
  let makeESprite (behaviors:Behavior list) (t:Texture)= 
    new ESprite(t, nextId(), behaviors)
  let getTexture name = 
    resources.Item(name).texture
  let addToContainer (c:Container) (s:Sprite)=
    c.addChild s |> ignore
    s
  let setPosition x y (s:Sprite)= 
    s.position <- Point(x, y)
    s
  let setAnchor x y (s:Sprite)= 
    s.anchor <- Point(x, y)
    s
  let setScale sx sy (s:Sprite)= 
    s.scale <- Point(sx, sy)
    s
  let drawRect (g:Graphics) color width height = 
    g.beginFill(float color) |> ignore
    g.drawRect(0.,0.,width, height) |> ignore 
    g.endFill() |> ignore
    g
  let setRotation r (s:Sprite) = 
    s.rotation <- r
    s
  let setAlpha a (s:Sprite) = 
    s.alpha <- a
    s
  let addToESprites (s:ESprite) = 
    sprites <- [s] @ sprites
    s
    
  let updateParticles trails = 
    trails 
      |> Seq.iter( fun e -> 
        let s : Sprite = e.sprite
        s.alpha <- s.alpha - e.dec
      )
    trails

  let addTrails() = 
    let addTotrails t = 
      trails <- {sprite=t;dec=0.002;} :: trails //.[trails.Length] <- {sprite=t;dec=0.001;}

    rocketsGreen
    |> Seq.iter( fun( rocket : Sprite) ->
        getTexture "plus" 
        |> makeSprite
        |> setPosition rocket.position.x rocket.position.y
        |> setAlpha 0.3
        |> setScale 0.2 0.2
        |> setAnchor rocket.anchor.x rocket.anchor.y
        |> setRotation rocket.rotation
        |> addToContainer greenContainer
        |> addTotrails )

    rocketsYellow
    |> Seq.iter( fun( rocket : Sprite) ->
        getTexture "minus" 
        |> makeSprite
        |> setPosition rocket.position.x rocket.position.y
        |> setAlpha 0.3
        |> setScale 0.2 0.2
        |> setAnchor rocket.anchor.x rocket.anchor.y
        |> setRotation rocket.rotation
        |> addToContainer yellowContainer
        |> addTotrails
        |> ignore )
        
    
  // our update loop
  let update(currentState) =
    trails <- updateParticles trails
    addTrails()
    
    match currentState with 
    | Nothing -> State.Nothing

    | Loading -> 

      let onLoadComplete r =

        let endLoadSequence r json =
          // hide loading bar
          Browser.window.document.getElementById("loading").style.display <- "none" 
          // save resources for later usage
          resources <- unbox<loaders.ResourceDictionary> r
          // parse json data to get nice array of CodeFrequencyData
          let rawData : ResizeArray<obj> = unbox json
          ghData <-
            rawData
              |> Seq.map( fun(inValue) ->
                let out : ResizeArray<float> = unbox inValue
                {timestamp=out.[0];deletion=out.[2];addition=out.[1]}
              )
              |> Seq.toList
            
          sum <- 
            ghData 
            |> Seq.map( fun(cd) -> cd.addition - cd.deletion ) 
            |> Seq.sum
          
          state <- MainTitle

        // try to get the code frenquency data from github
        // ref: https://developer.github.com/v3/repos/statistics/#get-contributors-list-with-additions-deletions-and-commit-counts
        // test: https://api.github.com/repos/fable-compiler/Fable/stats/code_frequency
        // Cache the value in local storage to avoid reaching the unauthorized rate limit (60 queries / hour)
        // ref: https://developer.github.com/v3/#rate-limiting
        let loadRemoteJson r (url:string) =
          let now = DateTime.Today
          let key = sprintf "fable_behaviors_cache_%s" (now.ToShortDateString())
          let cached : ResizeArray<obj>= 
            Browser.localStorage.getItem(key)
            |> function null -> "[]" | x -> unbox x 
            |> JS.JSON.parse |> unbox

          match cached with 
            | x when x.Count <= 0 -> 
              Browser.console.log ( "GitHub data not found in LocalStorage. Retrieveing data from GitHub")
              async {
                try
                  let! records = GlobalFetch.fetch(url) |> Async.AwaitPromise
                  let! json = records.json() |> Async.AwaitPromise
                  Browser.localStorage.setItem(key, JS.JSON.stringify json)
                  endLoadSequence r json
                with
                | error -> failwith( (sprintf "could not load json from url %s" url) )
              } |> Async.StartImmediate
            | _ ->
              Browser.console.log ( sprintf "Loading GitHub data from LocalStorage (%s)" key)
              endLoadSequence r cached

        loadRemoteJson r "https://api.github.com/repos/fable-compiler/Fable/stats/code_frequency"
      
    
      // start Loading
      let errorCallback(e) = Browser.console.log e 
      let onProgress(e) = Browser.console.log e

      let addAssetToLoad rawName =
        // extract the name of an asset
        // to be able to load easily
        let extractName (rawName:string) =
          let rawName = rawName.Substring(rawName.LastIndexOf('/')+1)
          let keys = rawName.Split([|'.'|])
          keys.[0]      
        Globals.loader.add(extractName rawName, "out/" + rawName) |> ignore

      addAssetToLoad "font.fnt"
      ["background"
        ;"feedbackgreen"
        ;"feedbackyellow"
        ;"greentrail"
        ;"yellowtrail"
        ;"maintitle"
        ;"github"
        ;"planet"
        ;"plus"
        ;"minus"
        ;"title2"
        ;"githubsmall"
        ;"minusband"
        ;"plusband"
      ] 
        |> Seq.map( fun(name) -> sprintf "%s.png" name)
        |> Seq.iter(addAssetToLoad)

      Globals.loader?on("error", errorCallback ) |> ignore
      Globals.loader.load() |> ignore
      Globals.loader?on("progress", onProgress ) |> ignore
      Globals.loader?once("complete", fun loader resources -> onLoadComplete resources ) |> ignore
      Nothing

    | MainTitle ->
        
      getTexture "background" 
        |> makeSprite
        |> addToContainer backgroundContainer
        |> setAlpha 0.6
        |> ignore

      
      let planetBreathe (es:ESprite) = 
        es.Behave(breathe(0.05, 0.022))
        es

      planet <-
        getTexture "planet" 
          |> makeESprite [fadeOut(Easing( Easing.Helpers.outCubic), 3000., ignore)] 
          |> planetBreathe
          |> addToESprites
          |> addToContainer planetContainer
          |> setAnchor 0.5 0.5
          |> setPosition centerX centerY
          |> setAlpha 0.

      title <- 
        getTexture "title2" 
          |> makeESprite [fadeOut(Easing( Easing.Helpers.outCubic), 3300., fun(s)-> printfn "done" )]
          |> addToESprites
          |> addToContainer planetContainer
          |> setAnchor 0.5 0.
          |> setPosition planet.position.x (planet.position.y + 50.) 
          |> setAlpha 0.

      let launchNext s = state <- NextDate

      subtitle <- 
        getTexture "githubsmall" 
          |> makeESprite [fadeOut(Easing( Easing.Helpers.outCubic), 3600., launchNext)]
          |> addToESprites
          |> addToContainer planetContainer
          |> setAnchor 0.5 0.
          |> setPosition title.position.x (title.position.y + title.height + 5.) 
          |> setAlpha 0.

      let margin = 480.
      minusBand <-
        getTexture "minusband" 
          |> makeSprite
          |> addToContainer planetContainer
          |> setAnchor 0. 0.5
          |> setPosition (centerX - margin) (rheight - 20.)

      plusBand <-
        getTexture "plusband" 
          |> makeSprite
          |> addToContainer planetContainer
          |> setAnchor 0. 0.5
          |> setPosition (centerX - margin) (rheight - 50.)

      getTexture "plus" 
        |> makeSprite
        |> addToContainer planetContainer
        |> setAnchor 0. 0.5
        |> setPosition ( plusBand.position.x - 40. ) plusBand.position.y
        |> ignore

      getTexture "minus" 
        |> makeSprite
        |> addToContainer planetContainer
        |> setAnchor 0. 0.5
        |> setPosition ( minusBand.position.x - 42. ) minusBand.position.y
        |> ignore

      maskPlus <- new Graphics()
      maskPlus.beginFill(float 0xFFFFFF) |> ignore
      maskPlus.drawRect(0.,0.,1., 20.) |> ignore
      maskPlus.endFill() |> ignore
      planetContainer.addChild(maskPlus) |> ignore
      maskPlus.position <- Point(plusBand.position.x,plusBand.position.y - 10.)           
      plusBand.mask <- Some(U2.Case1 maskPlus)

      textPlus <-  
        new extras.BitmapText("", 
        [
          Font (U2.Case1 "20px Josefin Sans")
          Align "left"
          Tint (float 0XB5D79D)
        ])
      let text = sprintf "%i" (JS.Math.ceil(plusSum) |> int )
      textPlus.text <- text
      textPlus.position <- Point(plusBand.position.x + maskPlus.width + 20.,plusBand.position.y - 10. )  
      planetContainer.addChild(textPlus) |> ignore
      
      maskMinus <- new Graphics()
      maskMinus.beginFill(float 0xFFFFFF) |> ignore
      maskMinus.drawRect(0.,0.,1., 20.) |> ignore
      maskMinus.endFill() |> ignore
      planetContainer.addChild(maskMinus) |> ignore
      maskMinus.position <- Point(minusBand.position.x,minusBand.position.y - 10.)           
      minusBand.mask <- Some(U2.Case1 maskMinus)

      textMinus <-  
        new extras.BitmapText("", 
        [
          Font (U2.Case1 "20px Josefin Sans")
          Align "left"
          Tint (float 0xFF9B00)
        ])
      let text = sprintf "%i" (JS.Math.ceil(minusSum) |> int )
      textMinus.text <- text
      textMinus.position <- Point(plusBand.position.x + maskMinus.width + 20.,minusBand.position.y - 10. )  
      planetContainer.addChild(textMinus) |> ignore

      Play

    | NextDate -> 
      
      // cleanup paticles
      yellowContainer.removeChildren() |> ignore
      greenContainer.removeChildren() |> ignore
      rocketsYellow <- [||]
      rocketsGreen <- [||]
      trails <- []

      match Seq.tryHead ghData with 
        | Some head ->
          let ratio = 0.003
          let additions = head.addition
          plusSum <- plusSum + additions
          let addPct = plusSum / sum * 1000.
          maskPlus.scale.x <- addPct
          let text = sprintf "[ + ] %i" (JS.Math.ceil(plusSum) |> int )
          textPlus.text <- text
          textPlus.position <- Point(plusBand.position.x + maskPlus.scale.x + 10.,plusBand.position.y - 10. )  

          let plusCount = JS.Math.ceil( additions * ratio ) |> int
          let deletions = -head.deletion

          minusSum <- minusSum + deletions
          let addPct = minusSum / sum * 1000.
          maskMinus.scale.x <- addPct
          let text = sprintf "[ - ] %i" (JS.Math.ceil(minusSum) |> int )
          textMinus.text <- text
          textMinus.position <- Point(plusBand.position.x + maskMinus.scale.x + 10.,minusBand.position.y - 10. )  
          
          let minusCount = JS.Math.ceil( deletions * ratio )|> int
          printfn "%i" minusCount
          
          let addToRockets s = 
            rocketsGreen.[rocketsGreen.Length] <- s
            s

          let addToRocketsYellow s = 
            rocketsYellow.[rocketsYellow.Length] <- s
            s
            
          // max time we allocate for anim
          let nextState() = state <- NextDate
          Browser.window.setTimeout( nextState, 3500. ) |> ignore
          let time = 1000.
          let addTime = 2000. / (float plusCount )
          {0..plusCount} 
            |> Seq.iter( fun(i) ->
              let onComplete(s:ESprite) =
                s.Behave( fade(Easing( Easing.Helpers.linear), 100.) ) 
              
              let posX = centerX + JS.Math.cos( (JS.Math.random() + 0.01) * 360. * Globals.DEG_TO_RAD) * 1200.
              let posY = centerY + JS.Math.sin( (JS.Math.random() + 0.01)  * 360. * Globals.DEG_TO_RAD ) * 1200.
              getTexture "plus" 
                |> makeESprite [
                    curveTo(Easing( Easing.Helpers.linear), time + (float i) * addTime, 10., Point(centerX, centerY), onComplete); 
                    alphaDeath(ignore)
                  ]
                |> addToESprites
                |> addToContainer plusContainer
                |> setAnchor 0.5 0.5
                |> setPosition posX posY //(rwidth + 50.) (JS.Math.random() * rheight) 
                |> addToRockets
                |> ignore
            )

          // max time we allocate for anim
          let addTime = 2000. / (float minusCount )
          {0..minusCount} 
            |> Seq.iter( fun(i) ->
              let onComplete(s:ESprite) =
                s.Behave( fade(Easing( Easing.Helpers.linear), 100.) ) 
              
              let posX = centerX + JS.Math.cos( (JS.Math.random() + 0.01) * 360. * Globals.DEG_TO_RAD) * 1200.
              let posY = centerY + JS.Math.sin( (JS.Math.random() + 0.01) * 360. * Globals.DEG_TO_RAD ) * 1200.
              let p = Point(posX,posY)
              getTexture "minus" 
                |> makeESprite [
                    curveTo(Easing( Easing.Helpers.inCubic), time + (float i) * addTime, 100., p, onComplete)
                    ;fade(Easing( Easing.Helpers.linear), time + (float i) * addTime)
                    ;alphaDeath(ignore)
                  ]
                |> addToESprites
                |> addToContainer minusContainer
                |> setAnchor 0.5 0.5
                |> setPosition centerX centerY
                |> addToRocketsYellow
                |> ignore
            )

          // current Date
          let date = new DateTime(1970,0,0,0,0,0)
          let date = date.AddSeconds(head.timestamp)
          let date = date.ToLongDateString ()
          
          let text = 
            new extras.BitmapText(date, 
            [
              Font (U2.Case1 "25px Josefin Sans")
              Align "left"
              Tint (float 0xFFFFFF)
            ])
          text.generateTexture(U2.Case2 renderer)
          |> makeESprite [
              fade(Easing( Easing.Helpers.inCubic), 3500. )
              ;alphaDeath(ignore)
          ] 
          |> addToESprites
          |> setAnchor 0.5 0.5
          |> setPosition 130. (plusBand.position.y - 30.)
          |> addToContainer planetContainer          
          |> ignore
                      
          // update list
          ghData <- ghData.Tail

        | None ->
          printfn "gameover"

      Play

    | Play -> Play

  // actual game loop
  let rec updateLoop render (dt:float) =
    promise {
        let mutable xs = []
        for x in sprites do
            do! x.Update(dt)
            if not x.IsDisposed then xs <- x::xs
        return xs }
    |> Promise.iter(fun sprites ->    
      state <- update(state)
      render()
      Browser.window.requestAnimationFrame(fun dt -> 
        updateLoop render dt) |> ignore )

  updateLoop 

let start divName = 
  let renderer =
        WebGLRenderer(1024., 600.,
            [ Antialias true
              BackgroundColor ( float 0x000000 )])
  Browser.document.getElementById("game").appendChild(renderer.view) |> ignore
  // start actual game loop
  let stage = Container(interactive=true)
  updateLoop renderer stage (fun () -> renderer.render(stage)) 0.

// start our game
start "game" 