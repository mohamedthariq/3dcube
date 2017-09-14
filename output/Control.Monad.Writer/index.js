// Generated by purs version 0.11.6
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Monad_Writer_Class = require("../Control.Monad.Writer.Class");
var Control_Monad_Writer_Trans = require("../Control.Monad.Writer.Trans");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Identity = require("../Data.Identity");
var Data_Newtype = require("../Data.Newtype");
var Data_Tuple = require("../Data.Tuple");
var Prelude = require("../Prelude");
var writer = function ($0) {
    return Control_Monad_Writer_Trans.WriterT(Control_Applicative.pure(Data_Identity.applicativeIdentity)($0));
};
var runWriter = function ($1) {
    return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(Control_Monad_Writer_Trans.runWriterT($1));
};
var mapWriter = function (f) {
    return Control_Monad_Writer_Trans.mapWriterT(function ($2) {
        return Data_Identity.Identity(f(Data_Newtype.unwrap(Data_Identity.newtypeIdentity)($2)));
    });
};
var execWriter = function (m) {
    return Data_Tuple.snd(runWriter(m));
};
module.exports = {
    execWriter: execWriter, 
    mapWriter: mapWriter, 
    runWriter: runWriter, 
    writer: writer
};
