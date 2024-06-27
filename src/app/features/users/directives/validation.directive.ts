import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {NgControl} from "@angular/forms";
import {distinctUntilChanged, Subscription} from "rxjs";

@Directive({
    selector: '[appInputValidation]',
    standalone: true
})
export class InputValidationDirective implements OnInit, OnDestroy {
    @Input('appInputValidation') inputName!: string;
    private subscription: Subscription | undefined;
    private errorMessageElement: HTMLElement | null = null;

    constructor(private el: ElementRef, private ngControl: NgControl, private readonly renderer: Renderer2) {
    }

    ngOnInit() {

        this.subscription = this.ngControl.statusChanges?.pipe(distinctUntilChanged()).subscribe(status => {
            if (status === 'INVALID') {
                this.markAsInvalid();
            } else {
                this.markAsValid();
            }
        });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    private markAsInvalid() {
        this.renderer.addClass(this.el.nativeElement, 'is-invalid');
        this.showErrorMessage();
    }

    private markAsValid() {
        this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
        this.removeErrorMessage();
    }

    private showErrorMessage() {
        if (this.errorMessageElement) return;

        this.errorMessageElement = this.renderer.createElement('div');
        const text = this.renderer.createText(`Please provide a correct ${this.inputName}`);
        this.renderer.appendChild(this.errorMessageElement, text);
        this.renderer.addClass(this.errorMessageElement, 'error-message');
        this.renderer.setStyle(this.errorMessageElement, 'color', 'red');

        const parent = this.renderer.parentNode(this.el.nativeElement);
        this.renderer.appendChild(parent, this.errorMessageElement);
    }

    private removeErrorMessage() {
        if (this.errorMessageElement) {
            const parent = this.renderer.parentNode(this.el.nativeElement);
            this.renderer.removeChild(parent, this.errorMessageElement);
            this.errorMessageElement = null;
        }
    }

}
