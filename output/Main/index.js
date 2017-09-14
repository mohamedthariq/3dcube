"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_JQuery = require("../Control.Monad.Eff.JQuery");
var Control_Monad_Eff_Timer = require("../Control.Monad.Eff.Timer");
var Control_Monad_ST = require("../Control.Monad.ST");
var DOM = require("../DOM");
var DOM_HTML = require("../DOM.HTML");
var DOM_HTML_Window = require("../DOM.HTML.Window");
var Data_Array = require("../Data.Array");
var Data_Array_Partial = require("../Data.Array.Partial");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Foldable = require("../Data.Foldable");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Int = require("../Data.Int");
var Data_Ord = require("../Data.Ord");
var Data_Ring = require("../Data.Ring");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var $$Math = require("../Math");
var Matrices = require("../Matrices");
var Partial_Unsafe = require("../Partial.Unsafe");
var Prelude = require("../Prelude");
var velocity = 1;
var speed = 10;
var rotationScale = 0.4;
var startSpeedometer = function (vr) {
    return function (mousePosRef) {
        return function (runFlagRef) {
            var looper = function (prevPos) {
                return function (velocities) {
                    var speedometer = function __do() {
                        var v = Control_Monad_ST.readSTRef(mousePosRef)();
                        var r = Matrices.rotationVector([ -(v.y - prevPos.y) * rotationScale, (v.x - prevPos.x) * rotationScale, 1.0, 1.0 ]);
                        var newVels = Data_Array.snoc(Data_Array_Partial.tail()(velocities))(r);
                        var v1 = Control_Monad_ST.readSTRef(runFlagRef)();
                        if (v1) {
                            return looper(v)(newVels)();
                        };
                        var v2 = Control_Monad_ST.readSTRef(vr)();
                        return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(vr)(Matrices.sum(Data_Foldable.foldableArray)([ Matrices.diff(newVels), v2 ])))();
                    };
                    return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Eff_Timer.setTimeout(velocity)(speedometer));
                };
            };
            return function __do() {
                var v = Control_Monad_ST.readSTRef(mousePosRef)();
                return looper(v)(Data_Array.replicate(5)(Matrices.noRotation))();
            };
        };
    };
};
var rotateCube = function (change) {
    return function (rotation) {
        return function __do() {
            var v = Control_Monad_Eff_JQuery.select(".cube")();
            var v1 = Control_Monad_ST.readSTRef(change)();
            Control_Monad_Eff_JQuery.css({
                transform: "matrix3d" + (Matrices.toString(Matrices.transformMatrixToString)(v1) + (" rotate3d" + Matrices.toString(Matrices.rotationVectorToString)(Matrices.multiply(v1)(rotation))))
            })(v)();
            var v2 = Control_Monad_Eff_JQuery.getCss("transform")(v)();
            return Matrices.toTransformMatrix(v2);
        };
    };
};
var startSpinner = function (change) {
    return function (vr) {
        var spinner = function __do() {
            var v = Control_Monad_ST.readSTRef(vr)();
            (function () {
                var $51 = Matrices.angle(v) !== 0.0;
                if ($51) {
                    return function __do() {
                        var v1 = rotateCube(change)(v)();
                        return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(change)(v1))();
                    };
                };
                return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
            })()();
            var v1 = DOM_HTML.window();
            return Data_Functor["void"](Control_Monad_Eff.functorEff)(DOM_HTML_Window.requestAnimationFrame(spinner)(v1))();
        };
        return spinner;
    };
};
var rotate = 30.0 / Data_Int.toNumber(speed);
var startMH = function (change) {
    return function (vr) {
        return function __do() {
            var v = Control_Monad_Eff_JQuery.body();
            var v1 = Control_Monad_ST.newSTRef({
                x: 0.0, 
                y: 0.0
            })();
            var downHandler = function (event) {
                return function (jq) {
                    return function __do() {
                        var v2 = Control_Monad_Eff_JQuery.getPageX(event)();
                        var v3 = Control_Monad_Eff_JQuery.getPageY(event)();
                        Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(v1)({
                            x: v2, 
                            y: v3
                        }))();
                        var v4 = Control_Monad_ST.newSTRef(true)();
                        var moveHandler = function (event$prime) {
                            return function (jq$prime) {
                                return function __do() {
                                    var v5 = Control_Monad_Eff_JQuery.getPageX(event$prime)();
                                    var v6 = Control_Monad_Eff_JQuery.getPageY(event$prime)();
                                    Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(v1)({
                                        x: v5, 
                                        y: v6
                                    }))();
                                    var dx = -(v6 - v3);
                                    var dy = v5 - v2;
                                    var rotation = Matrices.rotationVector([ dx, dy, 0.0, $$Math.sqrt(dx * dx + dy * dy) * rotationScale ]);
                                    return rotateCube(change)(rotation)();
                                };
                            };
                        };
                        var upHandler = function (event$prime) {
                            return function (jq$prime) {
                                return function __do() {
                                    var v5 = Control_Monad_Eff_JQuery.select(".cube")();
                                    Control_Monad_Eff_JQuery.off("mousemove")(v)();
                                    var v6 = Control_Monad_Eff_JQuery.getCss("transform")(v5)();
                                    Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(change)(Matrices.toTransformMatrix(v6)))();
                                    return Control_Monad_ST.writeSTRef(v4)(false)();
                                };
                            };
                        };
                        var decelerator = function __do() {
                            var v5 = Control_Monad_ST.readSTRef(vr)();
                            var v7 = Control_Monad_ST.readSTRef(v4)();
                            var $65 = v7 && Matrices.angle(v5) > 0.0;
                            if ($65) {
                                Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(vr)((function () {
                                    var $66 = Matrices.angle(v5) - rotate > 0.0;
                                    if ($66) {
                                        return Matrices.sc(Matrices.angle(v5) - rotate)(v5);
                                    };
                                    return Matrices.noRotation;
                                })()))();
                                return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Eff_Timer.setTimeout(1000 / speed | 0)(decelerator))();
                            };
                            return Data_Unit.unit;
                        };
                        Control_Monad_Eff_JQuery.on("mousemove")(moveHandler)(v)();
                        Control_Monad_Eff_JQuery.on("mouseup")(upHandler)(v)();
                        decelerator();
                        return startSpeedometer(vr)(v1)(v4)();
                    };
                };
            };
            return Control_Monad_Eff_JQuery.on("mousedown")(downHandler)(v)();
        };
    };
};
var execute = function __do() {
    var v = Control_Monad_Eff_JQuery.select(".cube")();
    var v1 = Control_Monad_Eff_JQuery.getCss("transform")(v)();
    var v2 = Control_Monad_ST.newSTRef(Matrices.toTransformMatrix(v1))();
    var v3 = Control_Monad_ST.newSTRef(Matrices.noRotation)();
    startSpinner(v2)(v3)();
    startMH(v2)(v3)();
    return Data_Unit.unit;
};
var drawCube = function __do() {
    var v = Control_Monad_Eff_JQuery.create("<p>")();
    Control_Monad_Eff_JQuery.setAttr("id")("fp")(v)();
    Control_Monad_Eff_JQuery.css({
        textAlign: "center", 
        paddingTop: "5px", 
        fontSize: "400%", 
        color: "#FF0000"
    })(v)();
    Control_Monad_Eff_JQuery.setText("1")(v)();
    var v1 = Control_Monad_Eff_JQuery.create("<p>")();
    Control_Monad_Eff_JQuery.setAttr("id")("bap")(v1)();
    Control_Monad_Eff_JQuery.css({
        textAlign: "center", 
        transform: "rotateY(180deg)", 
        paddingTop: "5px", 
        fontSize: "400%", 
        color: "#FF0000"
    })(v1)();
    Control_Monad_Eff_JQuery.setText("3")(v1)();
    var v2 = Control_Monad_Eff_JQuery.create("<p>")();
    Control_Monad_Eff_JQuery.setAttr("id")("rp")(v2)();
    Control_Monad_Eff_JQuery.css({
        textAlign: "center", 
        paddingTop: "5px", 
        fontSize: "400%", 
        color: "#00FF00"
    })(v2)();
    Control_Monad_Eff_JQuery.setText("4")(v2)();
    var v3 = Control_Monad_Eff_JQuery.create("<p>")();
    Control_Monad_Eff_JQuery.setAttr("id")("lp")(v3)();
    Control_Monad_Eff_JQuery.css({
        textAlign: "center", 
        transform: "rotateY(180deg)", 
        paddingTop: "5px", 
        fontSize: "400%", 
        color: "#00FF00"
    })(v3)();
    Control_Monad_Eff_JQuery.setText("2")(v3)();
    var v4 = Control_Monad_Eff_JQuery.create("<p>")();
    Control_Monad_Eff_JQuery.setAttr("id")("tp")(v4)();
    Control_Monad_Eff_JQuery.css({
        textAlign: "center", 
        paddingTop: "5px", 
        fontSize: "400%", 
        color: "#FF0000"
    })(v4)();
    Control_Monad_Eff_JQuery.setText("5")(v4)();
    var v5 = Control_Monad_Eff_JQuery.create("<p>")();
    Control_Monad_Eff_JQuery.setAttr("id")("bp")(v5)();
    Control_Monad_Eff_JQuery.css({
        textAlign: "center", 
        transform: "rotateY(180deg)", 
        paddingTop: "5px", 
        fontSize: "400%", 
        color: "#00FF00"
    })(v5)();
    Control_Monad_Eff_JQuery.setText("9")(v5)();
    var v6 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("front_face")(v6)();
    Control_Monad_Eff_JQuery.addClass("face")(v6)();
    Control_Monad_Eff_JQuery.append(v)(v6)();
    var v7 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("back_face")(v7)();
    Control_Monad_Eff_JQuery.addClass("face")(v7)();
    Control_Monad_Eff_JQuery.append(v1)(v7)();
    var v8 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("right_face")(v8)();
    Control_Monad_Eff_JQuery.addClass("face")(v8)();
    Control_Monad_Eff_JQuery.append(v2)(v8)();
    var v9 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("left_face")(v9)();
    Control_Monad_Eff_JQuery.addClass("face")(v9)();
    Control_Monad_Eff_JQuery.append(v3)(v9)();
    var v10 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("top_face")(v10)();
    Control_Monad_Eff_JQuery.addClass("face")(v10)();
    Control_Monad_Eff_JQuery.append(v4)(v10)();
    var v11 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("bottom_face")(v11)();
    Control_Monad_Eff_JQuery.addClass("face")(v11)();
    Control_Monad_Eff_JQuery.append(v5)(v11)();
    var v12 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.addClass("cube")(v12)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) translateY(-100px) translateZ(100px)", 
        backgroundColor: "white"
    })(v6)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) translateY(-100px) translateZ(-100px)", 
        backgroundColor: "white"
    })(v7)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateY(-100px) rotateY(90deg)", 
        backgroundColor: "white "
    })(v8)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateY(-100px) translateX(-200px) rotateY(90deg)", 
        backgroundColor: "white"
    })(v9)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) translateY(-200px) rotateX(90deg)", 
        backgroundColor: "white"
    })(v10)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) rotateX(90deg)", 
        backgroundColor: "white"
    })(v11)();
    Control_Monad_Eff_JQuery.css({
        position: "relative", 
        transformStyle: "preserve-3d"
    })(v12)();
    Control_Monad_Eff_JQuery.append(v6)(v12)();
    Control_Monad_Eff_JQuery.append(v7)(v12)();
    Control_Monad_Eff_JQuery.append(v8)(v12)();
    Control_Monad_Eff_JQuery.append(v9)(v12)();
    Control_Monad_Eff_JQuery.append(v10)(v12)();
    Control_Monad_Eff_JQuery.append(v11)(v12)();
    var v13 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("cube-wrapper")(v13)();
    Control_Monad_Eff_JQuery.css({
        position: "absolute", 
        left: "50%", 
        top: "50%", 
        perspective: "2000px"
    })(v13)();
    Control_Monad_Eff_JQuery.append(v12)(v13)();
    var v14 = Control_Monad_Eff_JQuery.body();
    Control_Monad_Eff_JQuery.append(v13)(v14)();
    Control_Monad_Eff_JQuery.css({
        width: "90%", 
        height: "90%", 
        backgroundColor: "#000000"
    })(v14)();
    var v15 = Control_Monad_Eff_JQuery.select(".face")();
    Control_Monad_Eff_JQuery.css({
        position: "absolute", 
        width: "200px", 
        height: "200px", 
        border: "solid black 2px"
    })(v15)();
    return Control_Monad_Eff_JQuery.css({
        transform: "rotateX(-60deg)rotateY(60deg)"
    })(v12)();
};
var main = function __do() {
    drawCube();
    return execute();
};
module.exports = {
    drawCube: drawCube, 
    execute: execute, 
    main: main, 
    rotate: rotate, 
    rotateCube: rotateCube, 
    rotationScale: rotationScale, 
    speed: speed, 
    startMH: startMH, 
    startSpeedometer: startSpeedometer, 
    startSpinner: startSpinner, 
    velocity: velocity
};
