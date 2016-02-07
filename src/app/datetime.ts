import {CORE_DIRECTIVES } from 'angular2/common';
import {Component, View, OnInit, OnChanges, AfterViewInit, OnDestroy, EventEmitter, Inject, ElementRef, Input, Output} from 'angular2/core';

import {Injectable } from 'angular2/core';

import {Directive, Renderer,  Self, forwardRef, Provider} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from 'angular2/common';
import {CONST_EXPR} from 'angular2/src/facade/lang';
import {Host} from "angular2/core";
import {DefaultValueAccessor} from "angular2/common";
import {NgModel} from "angular2/common";
import {HostBinding} from "angular2/core";
import {NG_VALIDATORS} from "angular2/common";
import {RegExpWrapper} from "angular2/src/facade/lang";
import {isPresent} from "angular2/src/facade/lang";

function datetimeValidator(c): {[key: string]: boolean} {
    if (c.value == null || c.value != "invalid") {
        return null;
    } else {
        return {"invalidDateTime": true};
    }
}

const datetimeValidatorBinding =
    CONST_EXPR(new Provider(NG_VALIDATORS , {useValue: datetimeValidator, multi: true}));

@Directive({
    selector: '[datetime]',
    host: {

        '(blur)' : 'onBlur()'
    },
    providers: [datetimeValidatorBinding]
})
export class DatetimeDirective extends DefaultValueAccessor {

    static ISO_DATE_FORMAT = "YYYY-MM-DD";
    static DATE_FORMAT = "DD/MM/YYYY";

    static ISO_DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
    static DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss";

    @Input() picktime : boolean = false;

    value : any;

    constructor(private model: NgModel, private el: ElementRef, private renderer: Renderer) {
        super(renderer, el);
        model.valueAccessor = this;
    }

    writeValue(obj: string): void {
        if (obj) {
            this.value =obj;
        }
    }

    ngOnInit() {
        super.writeValue(this.formatDatetime(this.value));
    }

    ngAfterViewInit() {

        $(this.el.nativeElement).datetimepicker({format : this.picktime?DatetimeDirective.DATE_TIME_FORMAT:DatetimeDirective.DATE_FORMAT});

        $(this.el.nativeElement).on('dp.change',  () => {

            this.onChange(this.parseDatetime($(this.el.nativeElement).val()));

        });
    }

    onBlur() {
        this.onTouched();
    }

    formatDatetime(datetime: string): string {
        return moment(datetime, this.picktime?DatetimeDirective.ISO_DATE_TIME_FORMAT:DatetimeDirective.ISO_DATE_FORMAT).format(this.picktime?DatetimeDirective.DATE_TIME_FORMAT:DatetimeDirective.DATE_FORMAT);
    }

    parseDatetime(inputString: string): any {

        inputString = inputString.trim();

        if(inputString == "") {
            return null;
        }

        let parsed =  moment(inputString, this.picktime?DatetimeDirective.DATE_TIME_FORMAT:DatetimeDirective.DATE_FORMAT);

        if(parsed.isValid()) {
            return parsed.format(this.picktime?DatetimeDirective.ISO_DATE_TIME_FORMAT:DatetimeDirective.ISO_DATE_FORMAT);

        } else {
            return "invalid";
        }

    }
}

