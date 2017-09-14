"use strict";
var Data_Array = require("../Data.Array");
var Data_Boolean = require("../Data.Boolean");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Foldable = require("../Data.Foldable");
var Data_Function = require("../Data.Function");
var Data_Int = require("../Data.Int");
var Data_Maybe = require("../Data.Maybe");
var Data_Number = require("../Data.Number");
var Data_Ord = require("../Data.Ord");
var Data_Ring = require("../Data.Ring");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Data_String = require("../Data.String");
var LinearAlgebra_Matrix = require("../LinearAlgebra.Matrix");
var $$Math = require("../Math");
var Prelude = require("../Prelude");
var TransformMatrix = function (x) {
    return x;
};
var RotationVector = function (x) {
    return x;
};
var MatrixToString = function (toString) {
    this.toString = toString;
};
var transformMatrixToString = new MatrixToString(function (v) {
    return "(" + (Data_Maybe.fromMaybe("")(Data_String.stripPrefix(", ")(Data_Foldable.foldl(Data_Foldable.foldableArray)(function (s) {
        return function (vec) {
            return s + Data_Foldable.foldl(Data_Foldable.foldableArray)(function (s$prime) {
                return function (n) {
                    return s$prime + (", " + Data_Show.show(Data_Show.showNumber)(n));
                };
            })("")(vec);
        };
    })("")(LinearAlgebra_Matrix.rows(v)))) + ")");
});
var toString = function (dict) {
    return dict.toString;
};
var rotationVectorToString = new MatrixToString(function (v) {
    return "(" + (Data_Maybe.fromMaybe("")(Data_String.stripPrefix(", ")(Data_Foldable.foldl(Data_Foldable.foldableArray)(function (s) {
        return function (vec) {
            return s + Data_Foldable.foldl(Data_Foldable.foldableArray)(function (s$prime) {
                return function (n) {
                    return s$prime + (", " + Data_Show.show(Data_Show.showNumber)(n));
                };
            })("")(vec);
        };
    })("")(LinearAlgebra_Matrix.rows(v)))) + "deg)");
});
var noTransformation = Data_Maybe.fromMaybe(LinearAlgebra_Matrix.identity(1))(LinearAlgebra_Matrix.fromArray(4)(4)([ 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ]));
var transformMatrix = function (a) {
    if (Data_Array.length(a) === 16) {
        return Data_Maybe.fromMaybe(LinearAlgebra_Matrix.identity(1))(LinearAlgebra_Matrix.fromArray(4)(4)(a));
    };
    if (Data_Boolean.otherwise) {
        return noTransformation;
    };
    throw new Error("Failed pattern match at Matrices line 23, column 1 - line 25, column 33: " + [ a.constructor.name ]);
};
var toTransformMatrix = function (str) {
    if (Data_String.contains("matrix3d(")(str)) {
        var a = Data_Foldable.foldl(Data_Foldable.foldableArray)(function (ar) {
            return function (s) {
                return Data_Semigroup.append(Data_Semigroup.semigroupArray)(ar)([ Data_Maybe.fromMaybe(0.0)(Data_Number.fromString(s)) ]);
            };
        })([  ])(Data_String.split(", ")(Data_Maybe.fromMaybe("")(Data_String.stripSuffix(")")(Data_Maybe.fromMaybe("")(Data_String.stripPrefix("matrix3d(")(str))))));
        var $14 = Data_Array.length(a) !== 16;
        if ($14) {
            return noTransformation;
        };
        return transformMatrix(a);
    };
    if (Data_Boolean.otherwise) {
        return noTransformation;
    };
    throw new Error("Failed pattern match at Matrices line 45, column 1 - line 56, column 33: " + [ str.constructor.name ]);
};
var noRotation = Data_Maybe.fromMaybe(LinearAlgebra_Matrix.identity(1))(LinearAlgebra_Matrix.fromArray(4)(1)([ 1.0e-3, 1.0e-3, 1.0e-3, 1.0e-3 ]));
var rotationVector = function (a) {
    if (Data_Array.length(a) === 4) {
        return Data_Maybe.fromMaybe(LinearAlgebra_Matrix.identity(1))(LinearAlgebra_Matrix.fromArray(4)(1)(a));
    };
    if (Data_Boolean.otherwise) {
        return noRotation;
    };
    throw new Error("Failed pattern match at Matrices line 17, column 1 - line 19, column 27: " + [ a.constructor.name ]);
};
var sc = function (s) {
    return function (v) {
        var x = Data_Maybe.fromMaybe(0.0)(LinearAlgebra_Matrix.element(0)(0)(v));
        var y = Data_Maybe.fromMaybe(0.0)(LinearAlgebra_Matrix.element(1)(0)(v));
        var a = (function () {
            var $18 = y === 0.0;
            if ($18) {
                return 0.0;
            };
            var $19 = x === 0.0;
            if ($19) {
                return $$Math.pi / 2.0;
            };
            return $$Math.atan($$Math.abs(y / x));
        })();
        return rotationVector([ s * $$Math.cos(a) * (function () {
            var $20 = x < 0.0;
            if ($20) {
                return -1.0;
            };
            return 1.0;
        })(), s * $$Math.sin(a) * (function () {
            var $21 = y < 0.0;
            if ($21) {
                return -1.0;
            };
            return 1.0;
        })(), 0.0, s ]);
    };
};
var sum = function (dictFoldable) {
    return function (vs) {
        var add = function (v) {
            return function (v1) {
                var a = Data_Array.zipWith(Data_Semiring.add(Data_Semiring.semiringNumber))(LinearAlgebra_Matrix.column(0)(v))(LinearAlgebra_Matrix.column(0)(v1));
                var x = Data_Maybe.fromMaybe(0.0)(Data_Array.index(a)(0));
                var y = Data_Maybe.fromMaybe(0.0)(Data_Array.index(a)(1));
                return rotationVector(Data_Maybe.fromMaybe([  ])(Data_Array.updateAt(3)($$Math.sqrt(x * x + y * y))(a)));
            };
        };
        return Data_Foldable.foldl(dictFoldable)(function (acc) {
            return function (v) {
                return add(acc)(v);
            };
        })(noRotation)(vs);
    };
};
var multiply = function (v) {
    return function (v1) {
        return LinearAlgebra_Matrix.multiply(v)(v1);
    };
};
var diff = function (vs) {
    var v = sum(Data_Foldable.foldableArray)(vs);
    var s = Data_Maybe.fromMaybe(0.0)(LinearAlgebra_Matrix.element(3)(0)(v)) / Data_Int.toNumber(Data_Array.length(vs));
    return sc(s)(v);
};
var angle = function (v) {
    return Data_Maybe.fromMaybe(0.0)(LinearAlgebra_Matrix.element(3)(0)(v));
};
module.exports = {
    RotationVector: RotationVector, 
    TransformMatrix: TransformMatrix, 
    MatrixToString: MatrixToString, 
    angle: angle, 
    diff: diff, 
    multiply: multiply, 
    noRotation: noRotation, 
    noTransformation: noTransformation, 
    rotationVector: rotationVector, 
    sc: sc, 
    sum: sum, 
    toString: toString, 
    toTransformMatrix: toTransformMatrix, 
    transformMatrix: transformMatrix, 
    transformMatrixToString: transformMatrixToString, 
    rotationVectorToString: rotationVectorToString
};
