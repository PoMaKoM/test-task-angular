import { Injectable } from '@angular/core';
import { UserApiService } from '../services/user-api.service';
import {
  catchError,
  debounceTime,
  first,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AvailableUsernameValidator implements AsyncValidator {
  constructor(private userApiService: UserApiService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(600),
      switchMap((value) => this.userApiService.checkUser(value)),
      first(),
      map((isAvailable) => (isAvailable ? null : { isUsernameTaken: true })),
      catchError(() => of(null)),
    );
  }
}
