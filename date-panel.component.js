"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment/moment");
var dialog_component_1 = require("./dialog.component");
var picker_service_1 = require("./picker.service");
var utils_1 = require("./utils");
var DatePanelComponent = (function () {
    function DatePanelComponent(service) {
        this.service = service;
        this.onDialogTypeChange = new core_1.EventEmitter();
        this.onCancelDialog = new core_1.EventEmitter();
        this.onConfirm = new core_1.EventEmitter();
        this.onSelected = new core_1.EventEmitter();
        this.yearList = [];
        this.momentFunc = moment.default ? moment.default : moment;
    }
    DatePanelComponent.prototype.ngOnChanges = function (changes) {
        if (changes['dialogType']) {
            this.type = changes['dialogType'].currentValue;
        }
    };
    DatePanelComponent.prototype.ngOnInit = function () {
        this.locale = this.service.dtLocale;
        this.mode = this.service.dtMode;
        this.onlyCurrent = this.service.dtOnlyCurrent;
        this.todayIconColor = utils_1.shadeBlendConvert(0.4, this.service.dtTheme);
        this.momentFunc.locale(this.locale);
        this.dayNames = this.momentFunc.weekdaysShort(true);
        this.monthList = this.momentFunc.monthsShort();
        this.now = this.momentFunc();
        this.moment = this.service.moment;
        this.generateCalendar();
    };
    DatePanelComponent.prototype.prevMonth = function () {
        this.moment = this.moment.clone().subtract(1, 'M');
        this.generateCalendar();
    };
    DatePanelComponent.prototype.nextMonth = function () {
        this.moment = this.moment.clone().add(1, 'M');
        this.generateCalendar();
    };
    DatePanelComponent.prototype.selectMonth = function (month) {
        this.moment = this.moment.clone().month(month);
        this.generateCalendar();
        this.toggleDialogType(dialog_component_1.DialogType.Month);
        return;
    };
    DatePanelComponent.prototype.selectYear = function (year) {
        this.moment = this.moment.clone().year(year);
        this.generateCalendar();
        this.toggleDialogType(dialog_component_1.DialogType.Year);
        return;
    };
    DatePanelComponent.prototype.toggleDialogType = function (type) {
        this.onDialogTypeChange.emit(type);
        if (type === dialog_component_1.DialogType.Year) {
            this.generateYearList();
        }
        return;
    };
    DatePanelComponent.prototype.generateYearList = function (param) {
        var start;
        if (param === 'prev') {
            start = this.yearList[0] - 9;
        }
        else if (param === 'next') {
            start = this.yearList[8] + 1;
        }
        else {
            start = +this.moment.clone().subtract(4, 'y').format('YYYY');
        }
        for (var i = 0; i < 9; i++) {
            this.yearList[i] = start + i;
        }
        return;
    };
    DatePanelComponent.prototype.select = function (moment) {
        if (!moment) {
            return;
        }
        if (this.selectedMoment &&
            this.selectedMoment.clone().startOf('date') === moment) {
            return;
        }
        if (moment.year() !== this.moment.year() ||
            moment.month() !== this.moment.month()) {
            this.moment = moment.clone();
            this.generateCalendar();
        }
        this.onSelected.emit(moment);
    };
    DatePanelComponent.prototype.selectToday = function () {
        this.select(this.now);
    };
    DatePanelComponent.prototype.cancelDialog = function () {
        this.onCancelDialog.emit(true);
        return;
    };
    DatePanelComponent.prototype.confirm = function () {
        this.onConfirm.emit(true);
        return;
    };
    DatePanelComponent.prototype.generateCalendar = function () {
        this.calendarDays = [];
        var start = 0 - (this.moment.clone().startOf('month').day() + (7 - this.momentFunc.localeData().firstDayOfWeek())) % 7;
        var end = 41 + start;
        for (var i = start; i <= end; i += 1) {
            var day = this.moment.clone().startOf('month').add(i, 'days');
            if (this.onlyCurrent && !day.isSame(this.moment, 'month')) {
                day = null;
            }
            this.calendarDays.push(day);
        }
    };
    return DatePanelComponent;
}());
DatePanelComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'dialog-date-panel',
                changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                template: "<div class=\"yk-date-panel\" [ngClass]=\"{\n    'small-mode': mode === 'dropdown' || mode === 'inline'}\"><div class=\"picker-control\"><div class=\"picker-control-nav\"><span class=\"nav-prev\" (click)=\"prevMonth()\"></span></div><div class=\"picker-control-content\"><div class=\"content\"><span class=\"month\" (click)=\"toggleDialogType(2)\">{{moment | moment: \"MMMM\"}}</span> <span class=\"year\" (click)=\"toggleDialogType(3)\">{{moment | moment: \"YYYY\"}}</span></div></div><div class=\"picker-control-nav\"><span class=\"nav-next\" (click)=\"nextMonth()\"></span></div></div><div class=\"picker-calendar\"><div [class.hidden]=\"type !== 1\" class=\"date\"><div class=\"picker-calendar-row\"><span class=\"picker-weekday\" *ngFor=\"let day of dayNames\">{{ day }}</span></div><div class=\"picker-calendar-row\"><div class=\"picker-day\" (click)=\"select(day)\" [ngClass]=\"{\n                        'picker-show': day,\n                        'picker-day-today': day  && day.isSame(now, 'day')\n                        }\" *ngFor=\"let day of calendarDays\" pickerCalendarHighlight [day]=\"day\" [selectedMoment]=\"selectedMoment\" [calendarMoment]=\"moment\"><span *ngIf=\"day  && day.isSame(now, 'day')\" class=\"today-icon\" [ngStyle]=\"{'border-top-color': todayIconColor}\"></span> <span *ngIf=\"day\">{{ day | moment: 'D'}}</span></div></div></div><div [class.hidden]=\"type !== 2\" class=\"month\"><div class=\"picker-calendar-row\"><span class=\"picker-month\" *ngFor=\"let month of monthList\" (click)=\"selectMonth(month)\" pickerCalendarHighlight [month]=\"month\" [calendarMoment]=\"moment\">{{month}}</span></div></div><div [class.hidden]=\"type !== 3\" class=\"year\"><div class=\"picker-calendar-row\"><span class=\"arrow-left\" (click)=\"generateYearList('prev')\"></span> <span class=\"picker-year\" *ngFor=\"let year of yearList\" (click)=\"selectYear(year)\" pickerCalendarHighlight [year]=\"year.toString()\" [calendarMoment]=\"moment\">{{year}} </span><span class=\"arrow-right\" (click)=\"generateYearList('next')\"></span></div></div></div><div class=\"picker-control footer\" [class.hidden]=\"type !== 1\"><div class=\"picker-action action-today\" (click)=\"selectToday()\"><span class=\"today-icon\" [ngStyle]=\"{'border-top-color': todayIconColor}\"></span> <span class=\"text\">{{ 'today' | translate }}</span></div><div class=\"picker-action action-close\" (click)=\"cancelDialog()\" [class.hidden]=\"mode === 'inline'\"><span class=\"text\">{{ 'close' | translate }}</span></div><div class=\"picker-action action-confirm\" pickerBtnHighlight (click)=\"confirm()\" [class.hidden]=\"mode === 'inline' || mode === 'dropdown'\"><span class=\"text\">{{ 'confirm' | translate }}</span></div></div></div>",
                styles: ["*,::after,::before{-moz-box-sizing:border-box;box-sizing:border-box}:host{position:absolute;top:0;left:0;width:100%;height:100%}.yk-date-panel{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%}.picker-control{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;height:40px;width:100%}.small-mode .picker-control{height:30px}@media only screen and (max-width:480px){.picker-control{height:30px}}.picker-control.footer{font-size:21.328px;line-height:40px;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;height:80px;cursor:pointer}.small-mode .picker-control.footer{font-size:12px;line-height:20px;height:40px}@media only screen and (max-width:480px){.picker-control.footer{font-size:12px;line-height:20px;height:40px}}.picker-control.footer.hidden{display:none}.picker-control.footer .picker-action{text-align:center;width:-webkit-calc(100% / 2);width:-moz-calc(100% / 2);width:calc(100% / 2)}.picker-control.footer .picker-action .text{padding-left:12.8px;padding-left:.8rem}.picker-control.footer .today-icon{display:inline-block;border-top:.66em solid;border-left:.66em solid transparent}.picker-control.footer .action-confirm{width:100%;color:#fff;-moz-border-radius:0 0 4px 4px;border-radius:0 0 4px 4px}.picker-control.footer .action-close::before,.picker-control.footer .action-confirm::before{content:\" \";position:relative;display:inline-block;height:0;width:0}.picker-control.footer .action-close::before{width:.8em;height:.8em;background:-webkit-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-webkit-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:-moz-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-moz-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:linear-gradient(to bottom,transparent 35%,#777 35%,#777 65%,transparent 65%),linear-gradient(to right,transparent 35%,#777 35%,#777 65%,transparent 65%);-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.picker-control.footer .action-confirm::before{width:.8em;height:.8em;-moz-border-radius:100%;border-radius:100%;background-color:#00b5ad}.picker-control-nav{position:relative;cursor:pointer;width:-webkit-calc(100% / 8);width:-moz-calc(100% / 8);width:calc(100% / 8)}.picker-control-nav>*{position:absolute;top:50%;right:auto;bottom:auto;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.picker-control-nav .nav-next::before,.picker-control-nav .nav-prev::before{content:\" \";border-top:.5em solid transparent;border-bottom:.5em solid transparent;border-right:.75em solid #000;width:0;height:0;display:block;margin:0 auto}.small-mode .picker-control-nav .nav-next::before,.small-mode .picker-control-nav .nav-prev::before{border-top:.4em solid transparent;border-bottom:.4em solid transparent;border-right:.6em solid #000}@media only screen and (max-width:480px){.picker-control-nav .nav-next::before,.picker-control-nav .nav-prev::before{border-top:.4em solid transparent;border-bottom:.4em solid transparent;border-right:.6em solid #000}}.picker-control-nav .nav-next::before{border-right:0;border-left:.75em solid #000}.small-mode .picker-control-nav .nav-next::before{border-right:0;border-left:.6em solid #000}@media only screen and (max-width:480px){.picker-control-nav .nav-next::before{border-right:0;border-left:.6em solid #000}}.picker-control-content{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;width:-webkit-calc(100% * 6 / 8);width:-moz-calc(100% * 6 / 8);width:calc(100% * 6 / 8);text-align:center}.picker-control-content .month,.picker-control-content .year{display:inline-block;cursor:pointer;-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;-moz-transition:transform .2s ease,-moz-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease,-moz-transform .2s ease}.picker-control-content .month:hover,.picker-control-content .year:hover{-webkit-transform:scale(1.2);-moz-transform:scale(1.2);-ms-transform:scale(1.2);transform:scale(1.2)}.picker-control-content .month{font-size:21.328px;line-height:40px;margin-right:8px;margin-right:.5rem;font-weight:700}.small-mode .picker-control-content .month{font-size:16px;line-height:20px}@media only screen and (max-width:480px){.picker-control-content .month{font-size:16px;line-height:20px}}.picker-control-content .year{font-style:italic;color:#999}.small-mode .picker-control-content .year{font-size:12px;line-height:20px}@media only screen and (max-width:480px){.picker-control-content .year{font-size:12px;line-height:20px}}.picker-calendar{-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:100%}.picker-calendar .picker-month,.picker-calendar .picker-year{font-size:21.328px;line-height:40px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;position:relative;height:40px;cursor:pointer;width:-webkit-calc(100% / 3);width:-moz-calc(100% / 3);width:calc(100% / 3)}.small-mode .picker-calendar .picker-month,.small-mode .picker-calendar .picker-year{font-size:16px;line-height:20px}@media only screen and (max-width:480px){.picker-calendar .picker-month,.picker-calendar .picker-year{font-size:16px;line-height:20px}}.picker-calendar .picker-weekday{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;position:relative;height:40px;font-weight:700;color:#999;width:-webkit-calc(100% / 7);width:-moz-calc(100% / 7);width:calc(100% / 7)}.small-mode .picker-calendar .picker-weekday{font-size:12px;line-height:20px;padding-left:3px}@media only screen and (max-width:480px){.picker-calendar .picker-weekday{font-size:12px;line-height:20px;padding-left:3px}}.picker-calendar .picker-day{font-size:21.328px;line-height:40px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;position:relative;height:40px;width:-webkit-calc(100% / 7);width:-moz-calc(100% / 7);width:calc(100% / 7)}.small-mode .picker-calendar .picker-day{font-size:16px;line-height:20px;height:30px}@media only screen and (max-width:480px){.picker-calendar .picker-day{font-size:16px;line-height:20px;height:30px}}.picker-calendar .picker-day.picker-show{cursor:pointer}.picker-calendar .picker-day .today-icon{position:absolute;right:2px;top:2px;border-top:.5em solid;border-left:.5em solid transparent}.picker-calendar-row{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;width:95%;margin:0 auto;position:relative}.year .picker-calendar-row{width:85%}.month .picker-calendar-row{width:90%}.picker-calendar-row .arrow-left,.picker-calendar-row .arrow-right{position:absolute;top:50%;width:25px;height:25px;-webkit-transform:translateY(-50%) scale(1);-moz-transform:translateY(-50%) scale(1);-ms-transform:translateY(-50%) scale(1);transform:translateY(-50%) scale(1);-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;-moz-transition:transform .2s ease,-moz-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease,-moz-transform .2s ease;z-index:9999;cursor:pointer;-moz-background-size:contain;background-size:contain}.small-mode .picker-calendar-row .arrow-left,.small-mode .picker-calendar-row .arrow-right{width:16px;height:16px}@media only screen and (max-width:480px){.picker-calendar-row .arrow-left,.picker-calendar-row .arrow-right{width:16px;height:16px}}.picker-calendar-row .arrow-left:hover,.picker-calendar-row .arrow-right:hover{-webkit-transform:translateY(-50%) scale(1.5);-moz-transform:translateY(-50%) scale(1.5);-ms-transform:translateY(-50%) scale(1.5);transform:translateY(-50%) scale(1.5)}.picker-calendar-row .arrow-left{left:-8%;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MC43MzggMjUwLjczOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjczOCAyNTAuNzM4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnIGlkPSJSb3VuZGVkX1JlY3RhbmdsZV8zM19jb3B5XzRfMV8iPgoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkOyIgZD0iTTk2LjYzMywxMjUuMzY5bDk1LjA1My05NC41MzNjNy4xMDEtNy4wNTUsNy4xMDEtMTguNDkyLDAtMjUuNTQ2ICAgYy03LjEtNy4wNTQtMTguNjEzLTcuMDU0LTI1LjcxNCwwTDU4Ljk4OSwxMTEuNjg5Yy0zLjc4NCwzLjc1OS01LjQ4Nyw4Ljc1OS01LjIzOCwxMy42OGMtMC4yNDksNC45MjIsMS40NTQsOS45MjEsNS4yMzgsMTMuNjgxICAgbDEwNi45ODMsMTA2LjM5OGM3LjEwMSw3LjA1NSwxOC42MTMsNy4wNTUsMjUuNzE0LDBjNy4xMDEtNy4wNTQsNy4xMDEtMTguNDkxLDAtMjUuNTQ0TDk2LjYzMywxMjUuMzY5eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.picker-calendar-row .arrow-right{right:-8%;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MC43MzggMjUwLjczOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjczOCAyNTAuNzM4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnIGlkPSJSb3VuZGVkX1JlY3RhbmdsZV8zM19jb3B5XzQiPgoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkOyIgZD0iTTE5MS43NSwxMTEuNjg5TDg0Ljc2Niw1LjI5MWMtNy4xLTcuMDU1LTE4LjYxMy03LjA1NS0yNS43MTMsMCAgIGMtNy4xMDEsNy4wNTQtNy4xMDEsMTguNDksMCwyNS41NDRsOTUuMDUzLDk0LjUzNGwtOTUuMDUzLDk0LjUzM2MtNy4xMDEsNy4wNTQtNy4xMDEsMTguNDkxLDAsMjUuNTQ1ICAgYzcuMSw3LjA1NCwxOC42MTMsNy4wNTQsMjUuNzEzLDBMMTkxLjc1LDEzOS4wNWMzLjc4NC0zLjc1OSw1LjQ4Ny04Ljc1OSw1LjIzOC0xMy42ODEgICBDMTk3LjIzNywxMjAuNDQ3LDE5NS41MzQsMTE1LjQ0OCwxOTEuNzUsMTExLjY4OXoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)}.hidden{display:none}"],
            },] },
];
DatePanelComponent.ctorParameters = function () { return [
    { type: picker_service_1.PickerService, },
]; };
DatePanelComponent.propDecorators = {
    'selectedMoment': [{ type: core_1.Input },],
    'dialogType': [{ type: core_1.Input },],
    'onDialogTypeChange': [{ type: core_1.Output },],
    'onCancelDialog': [{ type: core_1.Output },],
    'onConfirm': [{ type: core_1.Output },],
    'onSelected': [{ type: core_1.Output },],
};
exports.DatePanelComponent = DatePanelComponent;
//# sourceMappingURL=date-panel.component.js.map