#r "../node_modules/fable-core/Fable.Core.dll"
(*
-- Adapted from
-- Tweener's easing functions (Penner's Easing Equations)
-- and https://raw.githubusercontent.com/EmmanuelOga/easing/master/examples/simple/easing.lua (lua version)

-- For all easing functions:
-- let t = time
-- b = begin
-- c = change == ing - beginning
-- d = duration
*)
#nowarn "1182"
open Fable.Import.JS

module Helpers =

  let pow = Math.pow
  let sin = Math.sin
  let cos = Math.cos
  let pi = Math.PI
  let sqrlet t = Math.sqrt
  let asin  = Math.asin

  let linear (t:float) (b:float) (c:float) (d:float) : float =
     c * t / d + b


  let inQuad (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d
    c * pow(t, 2.) + b


  let outQuad (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d
    -c * t * (t - 2.) + b


  let inOutQuad (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d * 2.
    if t < 1. then
       c / 2. * pow(t, 2.) + b
    else
       -c / 2. * ((t - 1.) * (t - 3.) - 1.) + b


  let inCubic  (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d
    c * pow(t, 3.) + b


  let outCubic (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d - 1.
    c * (pow(t, 3.) + 1.) + b


  let inOutCubic (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d * 2.
    if t < 1. then
       c / 2. * t * t * t + b
    else
      let t = t - 2.
      c / 2. * (t * t * t + 2.) + b


  let outInCubic (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       outCubic (t * 2.) b (c / 2.) d
    else
       inCubic ((t * 2.) - d) (b + c / 2.) (c / 2.) d



  let inQuart (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d
    c * pow(t, 4.) + b


  let outQuart (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d - 1.
    -c * (pow(t, 4.) - 1.) + b


  let inOutQuart (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d * 2.
    if t < 1. then
       c / 2. * pow(t, 4.) + b
    else
      let t = t - 2.
      -c / 2. * (pow(t, 4.) - 2.) + b



  let outInQuart (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       outQuart (t * 2.) b (c / 2.) d
    else
       inQuart ((t * 2.) - d) (b + c / 2.) (c / 2.) d



  let inQuint (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d
    c * pow(t, 5.) + b


  let outQuint (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d - 1.
    c * (pow(t, 5.) + 1.) + b


  let inOutQuint (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d * 2.
    if t < 1. then
       c / 2. * pow(t, 5.) + b
    else
      let t = t - 2.
      c / 2. * (pow(t, 5.) + 2.) + b



  let outInQuint (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       outQuint (t * 2.)  b (c / 2.) d
    else
       inQuint ((t * 2.) - d) (b + c / 2.) (c / 2.) d


  let inSine (t:float) (b:float) (c:float) (d:float) : float =
     -c * cos(t / d * (pi / 2.)) + c + b


  let outSine (t:float) (b:float) (c:float) (d:float) : float =
     c * sin(t / d * (pi / 2.)) + b


  let inOutSine (t:float) (b:float) (c:float) (d:float) : float =
     -c / 2. * (cos(pi * t / d) - 1.) + b


  let outInSine (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       outSine (t * 2.) b (c / 2.) d
    else
       inSine ((t * 2.) - d) (b + c / 2.) (c / 2.) d


  let inExpo (t:float) (b:float) (c:float) (d:float) : float =
    if t = 0. then
       b
    else
       c * pow(2., 1.0 * (t / d - 1.)) + b - c * 0.001



  let outExpo (t:float) (b:float) (c:float) (d:float) : float =
    if t = d then
       b + c
    else
       c * 1.001 * (-pow(2., -1.0 * t / d) + 1.) + b



  let inOutExpo (t:float) (b:float) (c:float) (d:float) : float =
    if t = 0. then b
    elif t = d then  b + c
    else
      let t = t / d * 2.
      if t < 1. then
         c / 2. * pow(2., 1.0 * (t - 1.)) + b - c * 0.0005
      else
        let t = t - 1.
        c / 2. * 1.0005 * (-pow(2., -1.0 * t) + 2.) + b



  let outInExpo (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       outExpo (t * 2.) b (c / 2.) d
    else
       inExpo ((t * 2.) - d) (b + c / 2.) (c / 2.) d



  let inCirc (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d
    (-c * (sqrt(1. - pow(t, 2.)) - 1.) + b)


  let outCirc (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d - 1.
    (c * sqrt(1. - pow(t, 2.)) + b)


  let inOutCirc (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d * 2.
    if t < 1. then
       -c / 2. * (sqrt(1. - t * t) - 1.) + b
    else
      let t = t - 2.
      c / 2. * (sqrt(1. - t * t) + 1.) + b



  let outInCirc (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       outCirc (t * 2.) b (c / 2.) d
    else
       inCirc ((t * 2.) - d) (b + c / 2.) (c / 2.) d

       (*

  let inElastic (t:float) (b:float) (c:float) (d:float) (a:float) (p:float): float =
    if t = 0. then b
    else
      let t = t / d
      if t = 1. then  b + c
      else
        if p = 0. then p = d * 0.3
        let mutable s = 0.
        if a < Math.Abs(c) then
          a = c
          s = p / 4.
        else
          s = p / (2. * pi) * asin(c/a)

        let t = t - 1.
        -(a * pow(2., 1.0 * t) * sin((t * d - s) * (2. * pi) / p)) + b


  // a: amplitud
  // p: period
  let outElastic (t:float) (b:float) (c:float) (d:float) (a:float) (p:float): float =
    if t = 0. then b
    else
      let t = t / d
      if t = 1. then b + c
      else
        if not p then p = d * 0.3
        let mutable s = 0.
        if a < Math.Abs(c) then
          a = c
          s <- p / 4.
        else
          s <- p / (2. * pi) * asin(c/a)
          a * pow(2., -1.0 * t) * sin((t * d - s) * (2. * pi) / p) + c + b


  // p = period
  // a = amplitud
  let inOutElastic (t:float) (b:float) (c:float) (d:float) (a:float) (p:float): float =
    if t = 0 then  b
    let t = t / d * 2.
    if t = 2. then  b + c
    if not p then p = d * (0.3 * 1.5)
    if not a then a = 0

    if not a or a < Math.Abs(c) then
      a = c
      s = p / 4.
    else
      s = p / (2. * pi) * asin(c / a)


    if t < 1. then
      let t = t - 1.
      -0.5 * (a * pow(2., 1.0 * t) * sin((t * d - s) * (2. * pi) / p)) + b
    else
      let t = t - 1.
      a * pow(2., -1.0 * t) * sin((t * d - s) * (2. * pi) / p ) * 0.5 + c + b



  // a: amplitud
  // p: period
  let outInElastic (t:float) (b:float) (c:float) (d:float) (a:float) (p:float) : float =
    if t < d / 2. then
       outElastic(t * 2., b, c / 2., d, a, p)
    else
       inElastic((t * 2.) - d, b + c / 2., c / 2., d, a, p)

       *)
  let inBack (t:float) (b:float) (c:float) (d:float) (s:float option): float =
    let s = defaultArg s 1.70158
    let t = t / d
    c * t * t * ((s + 1.) * t - s) + b


  let outBack (t:float) (b:float) (c:float) (d:float) (s:float option): float =
    let s = defaultArg s 1.70158
    let t = t / d - 1.
    c * (t * t * ((s + 1.) * t + s) + 1.) + b


  let inOutBack (t:float) (b:float) (c:float) (d:float) (s:float option): float =
    let d = defaultArg s 1.70158
    let s = d * 1.525
    let t = t / d * 2.
    if t < 1. then
       c / 2. * (t * t * ((s + 1.) * t - s)) + b
    else
      let t = t - 2.
      c / 2. * (t * t * ((s + 1.) * t + s) + 2.) + b



  let outInBack (t:float) (b:float) (c:float) (d:float) (s:float option): float =
    if t < d / 2. then
       outBack (t * 2.) b (c / 2.) d s
    else
       inBack ((t * 2.) - d) (b + c / 2.) (c / 2.) d s

  let outBounce (t:float) (b:float) (c:float) (d:float) : float =
    let t = t / d
    if t < 1. / 2.75 then
       c * (7.5625 * t * t) + b
    elif t < 2. / 2.75 then
      let t = t - (1.5 / 2.75)
      c * (7.5625 * t * t + 0.75) + b
    elif t < 2.5 / 2.75 then
      let t = t - (2.25 / 2.75)
      c * (7.5625 * t * t + 0.9375) + b
    else
      let t = t - (2.625 / 2.75)
      c * (7.5625 * t * t + 0.984375) + b

  let inBounce (t:float) (b:float) (c:float) (d:float) : float =
     c - (outBounce (d - t) 0. c d) + b

  let inOutBounce (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       (inBounce (t * 2.) 0. c d) * 0.5 + b
    else
       (outBounce(t * 2. - d) 0. c d) * 0.5 + c * 0.5 + b


  let outInBounce (t:float) (b:float) (c:float) (d:float) : float =
    if t < d / 2. then
       outBounce (t * 2.) b (c / 2.) d
    else
       inBounce ((t * 2.) - d) (b + c / 2.) (c / 2.) d
