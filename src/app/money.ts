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

function moneyValidator(c): {[key: string]: boolean} {
    if (c.value == null || !isNaN(c.value)) {
        return null;
    } else {
        return {"invalidCreditCard": true};
    }
}

const moneyValidatorBinding =
    CONST_EXPR(new Provider(NG_VALIDATORS , {useValue: moneyValidator, multi: true}));

@Directive({
    selector: '[money]',
    host: {
        '(change)': 'onChanges($event.target.value)',
        '(blur)' : 'onBlur()'
    },
    providers: [moneyValidatorBinding]
})
export class MonyeDirective extends DefaultValueAccessor {

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
        super.writeValue(this.formatMoney(this.value));
    }

    ngAfterViewInit() {
        $(this.el.nativeElement).on("change", (t)=> {
            let val = this.parseMoney($(this.el.nativeElement).val());
            if (!isNaN(val) && val != null) {
                $(this.el.nativeElement).val(this.formatMoney(val));
            }
        });
    }

    onChanges(value: string) {
        this.onChange(this.parseMoney(value));
    }

    onBlur() {
        this.onTouched();
    }

    formatMoney(inputMontant: number): string {
        return numeral(inputMontant).format('0,0.00');
    }

    parseMoney(inputString: string): any {
        let parsedMontant = inputString.replace(",",".").replace(/\s+/g, "");
        if(parsedMontant == "") {
            return null;
        }
        return Number(parsedMontant);
    }
}

