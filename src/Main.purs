module Main where

import Prelude
import Control.Monad.Eff.JQuery
import Control.Monad.Eff.Timer
import Control.Monad.ST
import DOM.HTML
import DOM.HTML.Window
import Data.Int
import Math
import Matrices
import Partial.Unsafe
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.JQuery (append) as JQ
import DOM (DOM)
import Data.Array
import Data.Array.Partial (tail)

speed = 10
velocity = 1
rotationScale = 0.4
rotate = 30.0 / toNumber speed

drawCube :: forall e. Eff (dom :: DOM |e) Unit
drawCube = do

  fp <- create "<p>"
  setAttr "id" "fp" fp
  css{
    textAlign: "center",
    paddingTop: "5px",
    fontSize: "400%",
    color: "#FF0000"
  } fp
  setText "1" fp

  bap <- create "<p>"
  setAttr "id" "bap" bap
  css{
    textAlign: "center",
    transform: "rotateY(180deg)",
    paddingTop: "5px",
    fontSize: "400%",
    color: "#FF0000"
  } bap
  setText "3" bap

  rp <- create "<p>"
  setAttr "id" "rp" rp
  css{
    textAlign: "center",
    paddingTop: "5px",
    fontSize: "400%",
    color: "#00FF00"
  } rp
  setText "4" rp

  lp <- create "<p>"
  setAttr "id" "lp" lp
  css{
    textAlign: "center",
    transform: "rotateY(180deg)",
    paddingTop: "5px",
    fontSize: "400%",
    color: "#00FF00"
  } lp
  setText "2" lp

  tp <- create "<p>"
  setAttr "id" "tp" tp
  css{
    textAlign: "center",
    paddingTop: "5px",
    fontSize: "400%",
    color: "#FF0000"
  } tp
  setText "5" tp

  bp <- create "<p>"
  setAttr "id" "bp" bp
  css{
    textAlign: "center",
    transform: "rotateY(180deg)",
    paddingTop: "5px",
    fontSize: "400%",
    color: "#00FF00"
  } bp
  setText "9" bp

  frontFace <- create "<div>"
  setAttr "id" "front_face" frontFace
  addClass "face" frontFace
  JQ.append fp frontFace

  backFace <- create "<div>"
  setAttr "id" "back_face" backFace
  addClass "face" backFace
  JQ.append bap backFace

  rightFace <- create "<div>"
  setAttr "id" "right_face" rightFace
  addClass "face" rightFace
  JQ.append rp rightFace

  leftFace <- create "<div>"
  setAttr "id" "left_face" leftFace
  addClass "face" leftFace
  JQ.append lp leftFace

  topFace <- create "<div>"
  setAttr "id" "top_face" topFace
  addClass "face" topFace
  JQ.append tp topFace

  bottomFace <- create "<div>"
  setAttr "id" "bottom_face" bottomFace
  addClass "face" bottomFace
  JQ.append bp bottomFace

  cube <- create "<div>"
  addClass "cube" cube

  css {
  	transform : "translateX(-100px) translateY(-100px) translateZ(100px)",
    backgroundColor: "white"
  } frontFace

  css {
  	transform : "translateX(-100px) translateY(-100px) translateZ(-100px)",
    backgroundColor: "white"
  } backFace
  css {
  	transform : "translateY(-100px) rotateY(90deg)",
    backgroundColor: "white "
  } rightFace
  css {
    transform : "translateY(-100px) translateX(-200px) rotateY(90deg)",
    backgroundColor: "white"
  } leftFace
  css {
    transform : "translateX(-100px) translateY(-200px) rotateX(90deg)",
    backgroundColor: "white"
  } topFace
  css {
    transform : "translateX(-100px) rotateX(90deg)",
    backgroundColor: "white"
  } bottomFace

  css {
    position: "relative",
  	transformStyle: "preserve-3d"
    -- backgroundColor: "#000000"
  } cube

  JQ.append frontFace cube
  JQ.append backFace cube
  JQ.append rightFace cube
  JQ.append leftFace cube
  JQ.append topFace cube
  JQ.append bottomFace cube

  cubeWrapper <- create "<div>"
  setAttr "id" "cube-wrapper" cubeWrapper
  css {
    position : "absolute",
    left : "50%",
    top : "50%",
    perspective: "2000px"
  } cubeWrapper
  JQ.append cube cubeWrapper

  body <- body
  JQ.append cubeWrapper body

  css { width: "90%", height: "90%", backgroundColor:"#000000" } body

  face <- select ".face"
  css {
  	position : "absolute",
  	width : "200px",
  	height : "200px",
    border : "solid black 2px"
  } face

  -- blink <- select ".blink"
  -- css{
  --   textDecoration: "blink"
  -- } blinker
  --
  -- kb <- select "@-webkit-keyframes blinker"
  -- css{
  --   from {opacity: 0}
  -- }kb

  css { transform: "rotateX(-60deg)rotateY(60deg)"} cube


startSpeedometer vr mousePosRef runFlagRef = do
  let looper prevPos velocities = do
        let speedometer = do
              pos <- readSTRef mousePosRef
              let r = rotationVector [
                (negate (pos.y - prevPos.y)) * rotationScale,
                (pos.x - prevPos.x) * rotationScale,
                1.0, 1.0
              ]
              let newVels = snoc (unsafePartial tail velocities) r
              runFlag <- readSTRef runFlagRef
              if runFlag then looper pos newVels
                else do
                  currentVelocity <- readSTRef vr
                  void $ writeSTRef vr (sum [diff newVels, currentVelocity])
        void $ setTimeout velocity (speedometer)
  p <- readSTRef mousePosRef
  looper p (replicate 5 noRotation)

rotateCube change rotation = do
  cube <- select ".cube"
  transform <- readSTRef change
  css {
    transform: "matrix3d" <> toString transform
                  <> " rotate3d" <> (toString $ multiply transform rotation)
  } cube
  t <- getCss "transform" cube
  pure (toTransformMatrix t)

startMH change vr = do
  body <- body
  mousePosRef <- newSTRef {x:0.0,y:0.0}
  let downHandler event jq = do
        downX <- getPageX event
        downY <- getPageY event
        void $ writeSTRef mousePosRef {x: downX, y:downY}
        runFlagRef <- newSTRef true
        let moveHandler event' jq' = do
              x <- getPageX event'
              y <- getPageY event'
              void $ writeSTRef mousePosRef {x: x, y:y}
              let dx = negate (y - downY)
              let dy = x - downX
              let rotation = rotationVector [dx, dy, 0.0,
                    sqrt (dx * dx + dy * dy) * rotationScale]
              rotateCube change rotation
        let upHandler event' jq' = do
              cube <- select ".cube"
              off "mousemove" body
              t <- getCss "transform" cube
              void $ writeSTRef change (toTransformMatrix t)
              writeSTRef runFlagRef false
        let decelerator = do
              v <- readSTRef vr
              runFlag <- readSTRef runFlagRef
              if runFlag && angle v > 0.0 then do
                void $ writeSTRef vr $
                  if (angle v - rotate > 0.0) then sc (angle v - rotate) v else noRotation
                void $ setTimeout (1000 / speed) decelerator
                else pure unit
        on "mousemove" moveHandler body
        on "mouseup" upHandler body
        decelerator
        startSpeedometer vr mousePosRef runFlagRef
  on "mousedown" downHandler body


startSpinner change vr = do
  let spinner = do
        rotation <- readSTRef vr
        if angle rotation /= 0.0
          then do
            t <- rotateCube change rotation
            void $ writeSTRef change t
          else pure unit
        w <- window
        void $ requestAnimationFrame spinner w
  spinner

execute = do
  cube <- select ".cube"
  t <- getCss "transform" cube
  change <- newSTRef $ toTransformMatrix t
  vr <- newSTRef noRotation
  startSpinner change vr
  startMH change vr
  pure unit

main = do
  drawCube
  execute
