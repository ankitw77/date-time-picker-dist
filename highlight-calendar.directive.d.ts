import { ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
export declare class HighlightCalendarDirective implements OnChanges, OnInit {
    private el;
    private renderer;
    private service;
    day: Moment;
    month: string;
    year: string;
    selectedMoment: Moment;
    calendarMoment: Moment;
    private themeLightColor;
    private themeColor;
    private momentFunc;
    constructor(el: ElementRef, renderer: Renderer2, service: PickerService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    onMouseEnter(): void;
    onMouseLeave(): void;
    private isSelected();
    private isCalendarMonth();
    private isCalendarYear();
    private isOutFocus();
    private highlight(bgColor, color);
}
