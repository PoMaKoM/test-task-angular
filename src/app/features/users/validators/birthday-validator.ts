import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class BirthdayValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const { year, month, day } = control.value;
      return new Date(year, month - 1, day) < new Date(Date.now())
        ? null
        : { isDateAfterCurrent: true };
    }
    return null;
  }
}
