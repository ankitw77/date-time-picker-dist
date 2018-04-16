"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment/moment");
var picker_service_1 = require("./picker.service");
var translations_1 = require("./translations");
var translate_service_1 = require("./translate.service");
var DialogComponent = (function () {
    function DialogComponent(el, translate, service) {
        this.el = el;
        this.translate = translate;
        this.service = service;
        this.momentFunc = moment.default ? moment.default : moment;
    }
    DialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mode = this.service.dtMode;
        this.returnObject = this.service.dtReturnObject;
        this.pickerType = this.service.dtPickerType;
        this.translate.use(this.service.dtLocale);
        this.momentFunc.locale(this.service.dtLocale);
        this.now = this.momentFunc();
        this.subId = this.service.selectedMomentChange.subscribe(function (selectedMoment) {
            _this.selectedMoment = selectedMoment;
        });
        this.show = false;
        this.openDialog(this.initialValue);
    };
    DialogComponent.prototype.ngOnDestroy = function () {
        if (this.subId) {
            this.subId.unsubscribe();
        }
    };
    DialogComponent.prototype.openDialog = function (moment) {
        this.show = true;
        this.dialogType = this.service.dtDialogType;
        this.setSelectedMoment(moment);
        return;
    };
    DialogComponent.prototype.setSelectedMoment = function (moment) {
        this.service.setMoment(moment);
    };
    DialogComponent.prototype.cancelDialog = function () {
        this.show = false;
        return;
    };
    DialogComponent.prototype.setInitialMoment = function (value) {
        this.initialValue = value;
    };
    DialogComponent.prototype.setDialog = function (instance, elementRef, initialValue, dtLocale, dtViewFormat, dtReturnObject, dtPosition, dtPositionOffset, dtMode, dtHourTime, dtTheme, dtPickerType, dtShowSeconds, dtOnlyCurrent) {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;
        this.service.setPickerOptions(dtLocale, dtViewFormat, dtReturnObject, dtPosition, dtPositionOffset, dtMode, dtHourTime, dtTheme, dtPickerType, dtShowSeconds, dtOnlyCurrent);
    };
    DialogComponent.prototype.confirm = function (close) {
        this.returnSelectedMoment();
        if (close === true) {
            this.cancelDialog();
        }
        else {
            this.dialogType = this.service.dtDialogType;
        }
    };
    DialogComponent.prototype.toggleDialogType = function (type) {
        if (this.dialogType === type) {
            this.dialogType = this.service.dtDialogType;
        }
        else {
            this.dialogType = type;
        }
    };
    DialogComponent.prototype.setDate = function (moment) {
        this.service.setDate(moment);
        this.confirm(false);
    };
    DialogComponent.prototype.setTime = function (time) {
        this.service.setTime(time.hour, time.min, time.sec, time.meridian);
        if (this.service.dtPickerType === 'time') {
            this.confirm(true);
        }
        else {
            this.confirm(false);
        }
    };
    DialogComponent.prototype.returnSelectedMoment = function () {
        var m = this.selectedMoment || this.now;
        var selectedM = this.service.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
    };
    return DialogComponent;
}());
DialogComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'date-time-dialog',
                template: "<div class=\"picker-overlay\" [ngClass]=\"{'picker-overlay-dropdown': mode === 'dropdown'}\" *ngIf=\"(mode === 'popup' || mode === 'dropdown') && show\" (click)=\"cancelDialog()\"></div><div *ngIf=\"(show && (mode === 'dropdown' || mode === 'popup')) || mode === 'inline'\" [ngClass]=\"{\n        'picker-popup': mode === 'popup',\n        'picker-dropdown': mode === 'dropdown',\n        'picker-inline': mode === 'inline',\n        'small-mode': mode === 'dropdown' || mode === 'inline'}\" dialogPosition [directiveElementRef]=\"directiveElementRef\"><div class=\"picker-box\"><dialog-picker-header [dialogType]=\"dialogType\" [selectedMoment]=\"selectedMoment\" [now]=\"now\" (onDialogTypeChange)=\"toggleDialogType($event)\"></dialog-picker-header><div class=\"picker-content\"><dialog-date-panel *ngIf=\"pickerType === 'both' || pickerType === 'date'\" [ngClass]=\"{'picker-hidden': dialogType === 0}\" [selectedMoment]=\"selectedMoment\" [dialogType]=\"dialogType\" (onDialogTypeChange)=\"toggleDialogType($event)\" (onSelected)=\"setDate($event)\" (onCancelDialog)=\"cancelDialog()\" (onConfirm)=\"confirm($event)\"></dialog-date-panel><dialog-time-panel *ngIf=\"pickerType === 'both' || pickerType === 'time'\" [ngClass]=\"{'picker-hidden': dialogType !== 0}\" (onSetTime)=\"setTime($event)\"></dialog-time-panel></div></div></div>",
                styles: ["*,::after,::before{-moz-box-sizing:border-box;box-sizing:border-box}.picker-overlay{position:fixed;top:0;left:0;right:0;bottom:0;display:block;background-color:rgba(0,0,0,.3);z-index:999999}.picker-overlay.picker-overlay-dropdown{background-color:transparent}.picker-popup{position:fixed;top:0;left:50%;width:100vw;max-width:520px;height:100%;overflow:hidden;background-color:#fff;-moz-box-shadow:0 5px 15px rgba(0,0,0,.3);box-shadow:0 5px 15px rgba(0,0,0,.3);-moz-border-radius:5px;border-radius:5px;z-index:9999999;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);-ms-transform:translate(-50%,0);transform:translate(-50%,0);-webkit-animation:slideDown .3s cubic-bezier(.13,.68,1,1.53);-moz-animation:slideDown .3s cubic-bezier(.13,.68,1,1.53);animation:slideDown .3s cubic-bezier(.13,.68,1,1.53)}@media only screen and (min-width:768px){.picker-popup{top:30px;height:auto}}.picker-dropdown{max-width:100vw;min-width:250px;border:#777 solid 1px;position:absolute;z-index:9999999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff;-moz-border-radius:5px;border-radius:5px;-webkit-animation:popover .3s ease-in-out;-moz-animation:popover .3s ease-in-out;animation:popover .3s ease-in-out}@media only screen and (min-width:768px){.picker-dropdown{max-width:300px}}.picker-inline{max-width:300px;min-width:250px;border:#777 solid 1px;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff;-moz-border-radius:5px;border-radius:5px;display:inline-block}.picker-box{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;font-family:'Open Sans';width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker-content{position:relative;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:100%;height:380px}.small-mode .picker-content{height:260px}.picker-content .picker-hidden{visibility:hidden}@-webkit-keyframes popover{0%{opacity:0;-webkit-transform:translateY(-50px) scale(.8);transform:translateY(-50px) scale(.8)}80%{opacity:1;-webkit-transform:translateY(10px) scale(1.05);transform:translateY(10px) scale(1.05)}100%{opacity:1;-webkit-transform:translateY(0) scale(1);transform:translateY(0) scale(1)}}@-moz-keyframes popover{0%{opacity:0;-moz-transform:translateY(-50px) scale(.8);transform:translateY(-50px) scale(.8)}80%{opacity:1;-moz-transform:translateY(10px) scale(1.05);transform:translateY(10px) scale(1.05)}100%{opacity:1;-moz-transform:translateY(0) scale(1);transform:translateY(0) scale(1)}}@keyframes popover{0%{opacity:0;-webkit-transform:translateY(-50px) scale(.8);-moz-transform:translateY(-50px) scale(.8);transform:translateY(-50px) scale(.8)}80%{opacity:1;-webkit-transform:translateY(10px) scale(1.05);-moz-transform:translateY(10px) scale(1.05);transform:translateY(10px) scale(1.05)}100%{opacity:1;-webkit-transform:translateY(0) scale(1);-moz-transform:translateY(0) scale(1);transform:translateY(0) scale(1)}}@-webkit-keyframes slideDown{0%{opacity:0;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}100%{opacity:1;-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}}@-moz-keyframes slideDown{0%{opacity:0;-moz-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}100%{opacity:1;-moz-transform:translate(-50%,0);transform:translate(-50%,0)}}@keyframes slideDown{0%{opacity:0;-webkit-transform:translate(-50%,-100%);-moz-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}100%{opacity:1;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);transform:translate(-50%,0)}}"],
                providers: [picker_service_1.PickerService, translations_1.TRANSLATION_PROVIDERS, translate_service_1.TranslateService],
            },] },
];
DialogComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: translate_service_1.TranslateService, },
    { type: picker_service_1.PickerService, },
]; };
exports.DialogComponent = DialogComponent;
var DialogType;
(function (DialogType) {
    DialogType[DialogType["Time"] = 0] = "Time";
    DialogType[DialogType["Date"] = 1] = "Date";
    DialogType[DialogType["Month"] = 2] = "Month";
    DialogType[DialogType["Year"] = 3] = "Year";
})(DialogType = exports.DialogType || (exports.DialogType = {}));
//# sourceMappingURL=dialog.component.js.map