// Generated by purs version 0.11.6
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var DOM = require("../DOM");
var DOM_HTML_Types = require("../DOM.HTML.Types");
var DOM_Node_Types = require("../DOM.Node.Types");
var Data_Functor = require("../Data.Functor");
var Data_Maybe = require("../Data.Maybe");
var Data_Nullable = require("../Data.Nullable");
var Prelude = require("../Prelude");
var form = function ($0) {
    return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)($foreign._form($0));
};
module.exports = {
    form: form, 
    autofocus: $foreign.autofocus, 
    checkValidity: $foreign.checkValidity, 
    disabled: $foreign.disabled, 
    formAction: $foreign.formAction, 
    formEnctype: $foreign.formEnctype, 
    formMethod: $foreign.formMethod, 
    formNoValidate: $foreign.formNoValidate, 
    formTarget: $foreign.formTarget, 
    labels: $foreign.labels, 
    name: $foreign.name, 
    setAutofocus: $foreign.setAutofocus, 
    setCustomValidity: $foreign.setCustomValidity, 
    setDisabled: $foreign.setDisabled, 
    setFormAction: $foreign.setFormAction, 
    setFormEnctype: $foreign.setFormEnctype, 
    setFormMethod: $foreign.setFormMethod, 
    setFormNoValidate: $foreign.setFormNoValidate, 
    setFormTarget: $foreign.setFormTarget, 
    setName: $foreign.setName, 
    setType: $foreign.setType, 
    setValue: $foreign.setValue, 
    type_: $foreign.type_, 
    validationMessage: $foreign.validationMessage, 
    validity: $foreign.validity, 
    value: $foreign.value, 
    willValidate: $foreign.willValidate
};
