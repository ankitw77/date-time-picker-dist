"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment/moment");
var picker_service_1 = require("./picker.service");
var utils_1 = require("./utils");
var black = '#000000';
var white = '#FFFFFF';
var grey = '#dddddd';
var HighlightCalendarDirective = (function () {
    function HighlightCalendarDirective(el, renderer, service) {
        this.el = el;
        this.renderer = renderer;
        this.service = service;
        this.momentFunc = moment.default ? moment.default : moment;
        this.themeColor = this.service.dtTheme;
        this.themeLightColor = utils_1.shadeBlendConvert(0.7, this.themeColor);
        this.momentFunc.locale(this.service.dtLocale);
    }
    HighlightCalendarDirective.prototype.ngOnChanges = function (changes) {
        if (this.day && changes['selectedMoment'] &&
            changes['selectedMoment'].currentValue) {
            if (this.isSelected()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-day-selected');
            }
            else {
                var color = this.isOutFocus() ? grey : black;
                this.highlight(null, color);
                this.renderer.removeClass(this.el.nativeElement, 'picker-day-selected');
            }
        }
        if (this.month && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarMonth()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-month-current');
            }
            else {
                this.highlight(null, black);
                this.renderer.removeClass(this.el.nativeElement, 'picker-month-current');
            }
        }
        if (this.year && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarYear()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-year-current');
            }
            else {
                this.highlight(null, black);
                this.renderer.removeClass(this.el.nativeElement, 'picker-year-current');
            }
        }
    };
    HighlightCalendarDirective.prototype.ngOnInit = function () {
        if (this.isOutFocus()) {
            this.highlight(null, grey);
        }
    };
    HighlightCalendarDirective.prototype.onMouseEnter = function () {
        if (this.isSelected() || this.isCalendarMonth() || this.isCalendarYear()) {
            return;
        }
        this.highlight(this.themeLightColor, black);
    };
    HighlightCalendarDirective.prototype.onMouseLeave = function () {
        if (this.isSelected() || this.isCalendarMonth() || this.isCalendarYear()) {
            return;
        }
        var color = this.isOutFocus() ? grey : black;
        this.highlight(null, color);
    };
    HighlightCalendarDirective.prototype.isSelected = function () {
        return this.day && this.selectedMoment && this.day.isSame(this.selectedMoment, 'day');
    };
    HighlightCalendarDirective.prototype.isCalendarMonth = function () {
        return this.month && this.calendarMoment && this.month === this.calendarMoment.format('MMM');
    };
    HighlightCalendarDirective.prototype.isCalendarYear = function () {
        return this.year && this.calendarMoment && this.year === this.calendarMoment.format('YYYY');
    };
    HighlightCalendarDirective.prototype.isOutFocus = function () {
        return this.day && this.calendarMoment && !this.day.isSame(this.calendarMoment, 'month');
    };
    HighlightCalendarDirective.prototype.highlight = function (bgColor, color) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', bgColor);
        this.renderer.setStyle(this.el.nativeElement, 'color', color);
    };
    return HighlightCalendarDirective;
}());
HighlightCalendarDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[pickerCalendarHighlight]'
            },] },
];
HighlightCalendarDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer2, },
    { type: picker_service_1.PickerService, },
]; };
HighlightCalendarDirective.propDecorators = {
    'day': [{ type: core_1.Input },],
    'month': [{ type: core_1.Input },],
    'year': [{ type: core_1.Input },],
    'selectedMoment': [{ type: core_1.Input },],
    'calendarMoment': [{ type: core_1.Input },],
    'onMouseEnter': [{ type: core_1.HostListener, args: ['mouseenter',] },],
    'onMouseLeave': [{ type: core_1.HostListener, args: ['mouseleave',] },],
};
exports.HighlightCalendarDirective = HighlightCalendarDirective;
//# sourceMappingURL=highlight-calendar.directive.js.map