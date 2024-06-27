import { Injectable } from '@angular/core';
import { UserApiService } from '../services/user-api.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class BirthdayValidator implements Validator {
  constructor(private userApiService: UserApiService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      switchMap((value) => this.userApiService.getIsUsernameAvailable(value)),
      map(({ isAvailable }) => (isAvailable ? null : { isAvailable: true })),
      catchError(() => of(null)),
    );
  }
}
