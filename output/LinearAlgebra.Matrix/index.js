// Generated by purs version 0.11.6
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Data_Array = require("../Data.Array");
var Data_Boolean = require("../Data.Boolean");
var Data_Eq = require("../Data.Eq");
var Data_Function = require("../Data.Function");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Maybe = require("../Data.Maybe");
var Data_Ord = require("../Data.Ord");
var Data_Ring = require("../Data.Ring");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var LinearAlgebra_Vector = require("../LinearAlgebra.Vector");
var Prelude = require("../Prelude");
var Dense = (function () {
    function Dense(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    Dense.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new Dense(value0, value1, value2);
            };
        };
    };
    return Dense;
})();
var zeros = function (r) {
    return function (c) {
        var r$prime = (function () {
            var $23 = r > 0;
            if ($23) {
                return r;
            };
            return 1;
        })();
        var c$prime = (function () {
            var $24 = c > 0;
            if ($24) {
                return c;
            };
            return 1;
        })();
        return new Dense(r$prime, c$prime, Data_Array.replicate(r$prime * c$prime | 0)(0.0));
    };
};
var toVector = function (v) {
    return v.value2;
};
var sliceRows = function (r1) {
    return function (r2) {
        return function (v) {
            var ds = Data_Array.slice(r1 * v.value1 | 0)((r2 + 1 | 0) * v.value1 | 0)(v.value2);
            return new Dense((r2 - r1 | 0) + 1 | 0, v.value1, ds);
        };
    };
};
var sliceCols = function (c1) {
    return function (c2) {
        return function (v) {
            var f = function (r) {
                return Data_Array.slice((r * v.value1 | 0) + c1 | 0)(((r * v.value1 | 0) + c2 | 0) + 1 | 0)(v.value2);
            };
            var ds = Data_Array.concatMap(f)(Data_Array.range(0)(v.value0 - 1 | 0));
            return new Dense(v.value0, (c2 - c1 | 0) + 1 | 0, ds);
        };
    };
};
var showMatrix = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "Dense Matrix nrows=" + (Data_Show.show(Data_Show.showInt)(v.value0) + (", ncols=" + (Data_Show.show(Data_Show.showInt)(v.value1) + (", data=" + Data_Show.show(Data_Show.showArray(dictShow))(v.value2)))));
    });
};
var row = function (r) {
    return function (v) {
        var i = (function () {
            var $47 = r >= 0 && r < v.value0;
            if ($47) {
                return r * v.value1 | 0;
            };
            return 0;
        })();
        var j = (function () {
            var $48 = r >= 0 && r < v.value0;
            if ($48) {
                return i + v.value1 | 0;
            };
            return 0;
        })();
        return Data_Array.slice(i)(j)(v.value2);
    };
};
var replicate = function (r) {
    return function (c) {
        return function (v) {
            if (r > 0 && c > 0) {
                return Data_Maybe.Just.create(new Dense(r, c, Data_Array.replicate(r * c | 0)(v)));
            };
            if (Data_Boolean.otherwise) {
                return Data_Maybe.Nothing.value;
            };
            throw new Error("Failed pattern match at LinearAlgebra.Matrix line 62, column 1 - line 62, column 55: " + [ r.constructor.name, c.constructor.name, v.constructor.name ]);
        };
    };
};
var nrows = function (v) {
    return v.value0;
};
var rows = function (mat) {
    return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(0)(nrows(mat) - 1 | 0))(function (v) {
        return Control_Applicative.pure(Control_Applicative.applicativeArray)(row(v)(mat));
    });
};
var ncols = function (v) {
    return v.value1;
};
var multiply$prime = function (rx) {
    return function (cy) {
        return Control_Bind.bind(Control_Bind.bindArray)(rx)(function (v) {
            return Control_Bind.bind(Control_Bind.bindArray)(cy)(function (v1) {
                return Control_Applicative.pure(Control_Applicative.applicativeArray)(Data_Maybe.fromMaybe(0.0)(LinearAlgebra_Vector.dot(Data_Semiring.semiringNumber)(v)(v1)));
            });
        });
    };
};
var insertCol = function (i) {
    return function (v) {
        return function (v1) {
            var f = function (r) {
                return Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_Array.slice(r * v1.value1 | 0)((r * v1.value1 | 0) + i | 0)(v1.value2))(Data_Semigroup.append(Data_Semigroup.semigroupArray)(Data_Array.slice(r)(r + 1 | 0)(v))(Data_Array.slice((r * v1.value1 | 0) + i | 0)((r + 1 | 0) * v1.value1 | 0)(v1.value2)));
            };
            var ds = Data_Array.concatMap(f)(Data_Array.range(0)(v1.value0 - 1 | 0));
            return new Dense(v1.value0, v1.value1 + 1 | 0, ds);
        };
    };
};
var identity$prime = function (n) {
    return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(n))(function (v) {
        return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(n))(function (v1) {
            return Control_Applicative.pure(Control_Applicative.applicativeArray)((function () {
                var $74 = v === v1;
                if ($74) {
                    return 1.0;
                };
                return 0.0;
            })());
        });
    });
};
var identity = function (n) {
    return new Dense(n, n, identity$prime(n));
};
var fromRow = function (vs) {
    return new Dense(1, Data_Array.length(vs), vs);
};
var fromColumn = function (vs) {
    return new Dense(Data_Array.length(vs), 1, vs);
};
var fromArray = function (r) {
    return function (c) {
        return function (vs) {
            if (r > 0 && (c > 0 && (r * c | 0) === Data_Array.length(vs))) {
                return new Data_Maybe.Just(new Dense(r, c, vs));
            };
            if (Data_Boolean.otherwise) {
                return Data_Maybe.Nothing.value;
            };
            throw new Error("Failed pattern match at LinearAlgebra.Matrix line 87, column 1 - line 87, column 60: " + [ r.constructor.name, c.constructor.name, vs.constructor.name ]);
        };
    };
};
var eqMatrix = function (dictEq) {
    return new Data_Eq.Eq(function (v) {
        return function (v1) {
            return v.value0 === v1.value0 && (v.value1 === v1.value1 && Data_Eq.eq(Data_Eq.eqArray(dictEq))(v.value2)(v1.value2));
        };
    });
};
var element = function (r) {
    return function (c) {
        return function (v) {
            return Data_Array.index(v.value2)((r * v.value1 | 0) + c | 0);
        };
    };
};
var column = function (c) {
    return function (v) {
        return Data_Array.mapMaybe(function (i) {
            return Data_Array.index(v.value2)((i * v.value1 | 0) + c | 0);
        })(Data_Array.range(0)(v.value0 - 1 | 0));
    };
};
var columns = function (mat) {
    return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(0)(ncols(mat) - 1 | 0))(function (v) {
        return Control_Applicative.pure(Control_Applicative.applicativeArray)(column(v)(mat));
    });
};
var multiply = function (xs) {
    return function (ys) {
        if (ncols(xs) !== nrows(ys)) {
            return zeros(1)(1);
        };
        if (Data_Boolean.otherwise) {
            return Dense.create(nrows(xs))(ncols(ys))(multiply$prime(rows(xs))(columns(ys)));
        };
        throw new Error("Failed pattern match at LinearAlgebra.Matrix line 170, column 1 - line 170, column 60: " + [ xs.constructor.name, ys.constructor.name ]);
    };
};
var transpose = function (v) {
    var ds$prime = Data_Array.concat(columns(new Dense(v.value0, v.value1, v.value2)));
    return new Dense(v.value1, v.value0, ds$prime);
};
var add = function (v) {
    return function (v1) {
        if (v.value0 !== v1.value0 || v.value1 !== v1.value1) {
            return zeros(1)(1);
        };
        if (Data_Boolean.otherwise) {
            return Dense.create(v.value0)(v.value1)(LinearAlgebra_Vector.add(Data_Semiring.semiringNumber)(v.value2)(v1.value2));
        };
        throw new Error("Failed pattern match at LinearAlgebra.Matrix line 190, column 1 - line 190, column 55: " + [ v.constructor.name, v1.constructor.name ]);
    };
};
module.exports = {
    add: add, 
    column: column, 
    columns: columns, 
    element: element, 
    fromArray: fromArray, 
    fromColumn: fromColumn, 
    fromRow: fromRow, 
    identity: identity, 
    insertCol: insertCol, 
    multiply: multiply, 
    ncols: ncols, 
    nrows: nrows, 
    replicate: replicate, 
    row: row, 
    rows: rows, 
    sliceCols: sliceCols, 
    sliceRows: sliceRows, 
    toVector: toVector, 
    transpose: transpose, 
    zeros: zeros, 
    eqMatrix: eqMatrix, 
    showMatrix: showMatrix
};
