import { EventEmitter, OnInit } from '@angular/core';
import { PickerService } from './picker.service';
import { DialogType } from './dialog.component';
import { Moment } from 'moment';
export declare class PickerHeaderComponent implements OnInit {
    private service;
    dialogType: DialogType;
    selectedMoment: Moment;
    now: Moment;
    onDialogTypeChange: EventEmitter<DialogType>;
    hourTime: '12' | '24';
    showSeconds: boolean;
    pickerType: 'both' | 'date' | 'time';
    mode: 'popup' | 'dropdown' | 'inline';
    themeColor: string;
    constructor(service: PickerService);
    ngOnInit(): void;
    setDialogType(type: DialogType): void;
}
