import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { COUNTRIES_LIST } from '../../../shared/enum/country';

@Injectable({
  providedIn: 'root',
})
export class CountryValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const normalizedCountries = COUNTRIES_LIST.map((value) =>
      value.toLowerCase(),
    );
    const normalizedControl = control.value?.toLowerCase();
    return normalizedCountries.includes(normalizedControl)
      ? null
      : { isCorrectCountry: true };
  }
}
