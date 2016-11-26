(**
 - title: Fable behaviors sample
 - tagline: fun with behaviors
 - app-style: width:1024px; margin:20px auto 50px auto;
 - require-paths: `'PIXI':'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/3.0.11/pixi.min'`
 - intro: Just a try to implement the Fable architecture over Pixi. This is an experimentation for the moment
*)

#r "../node_modules/fable-core/Fable.Core.dll"
#r "../node_modules/fable-powerpack/Fable.PowerPack.dll"
#load "../node_modules/fable-import-pixi/Fable.Import.Pixi.fs"

open System
open System.Collections.Generic
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import.PIXI
open Fable.Import.PIXI.extras
open Fable.Import
open Fable.PowerPack

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
  | MainTitle of obj
  | Play 

and RenderingContext private() =
  let renderer : WebGLRenderer= 
    WebGLRenderer( 
      1024., 
      600., 
      [
        Antialias true
        BackgroundColor ( float 0x020b1e )
      ]
    )
  // our root container 
  let stage = new Sprite() 

  static let instance = RenderingContext()
  static member Instance = instance
  member self.SetInteractive() =
    stage.interactive <- true// start our loading
  member self.GetRenderer() =
    renderer
  member self.GetKnownRenderer() = 
    U2.Case2 renderer
  member self.GetView() = 
    renderer.view
  member self.Render() = 
    renderer.render stage
  member self.GetRoot() = 
    stage
  member self.GetBounds() =
    Rectangle(0.,0.,renderer.width, renderer.height)

// Behaviors -------------------------------------------

module Behaviors =
    let private distanceBetween2Points (p1:Point) (p2:Point) =
        let tx = p2.x - p1.x
        let ty = p2.y - p1.y
        JS.Math.sqrt( tx * tx + ty * ty)

    let accelerate(acc: Point) = Behavior(fun s _ ->
        s.position <- Point(s.position.x * acc.x, s.position.y + acc.y)
        Promise.lift true)



// Animation ------------------------------------------------
open Behaviors

let updateLoop fps =
  let mutable state : State = Loading
  let onLoadComplete = fun(r) -> state <- MainTitle r

  let backgroundContainer = Container()
  let stage = RenderingContext.Instance.GetRoot()
  stage.addChild backgroundContainer |> ignore

  let update(state) =
    match state with 
    | Nothing -> State.Nothing

    | Loading -> 
      printfn "start Loading" 

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

      ["background.png"] |> Seq.iter(addAssetToLoad)              
      Globals.loader?on("error", errorCallback ) |> ignore
      Globals.loader.load() |> ignore
      Globals.loader?on("progress", onProgress ) |> ignore
      Globals.loader?once("complete", fun loader resources -> onLoadComplete resources ) |> ignore
      Nothing

    | MainTitle(r) ->
      let resources = unbox<loaders.ResourceDictionary> r
      printfn "loading done" 

      backgroundContainer.addChild( Sprite(resources.Item("background").texture) ) |> ignore

      Play

    | Play -> Play

  // actual game loop
  let rec updateLoop(dt:float) =
    state <- update(state)
    RenderingContext.Instance.Render()
    Browser.window.requestAnimationFrame(fun dt -> updateLoop dt) |> ignore

  updateLoop

let start divName fps  = 
  let view = RenderingContext.Instance.GetView()
  // append renderer to our div element
  Browser.document.getElementById(divName).appendChild( view ) |> ignore
  view.style.display <- "block"
  view.style.margin <- "0 auto"
  // start actual game loop
  updateLoop fps 0.

// start our game
start "game" 60.