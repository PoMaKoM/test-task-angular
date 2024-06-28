import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { UserApiService } from '../../services/user-api.service';
import { COUNTRIES_LIST } from '../../../../shared/enum/country';
import { UserGroup, UserGroupValue } from '../../models/user-group.model';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
  take,
  takeWhile,
  tap,
  timer,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AvailableUsernameValidator } from '../../validators/available-username.validator';
import { InputValidationDirective } from '../../directives/validation.directive';
import { CountryValidator } from '../../validators/country.validator';
import { BirthdayValidator } from '../../validators/birthday-validator';

@Component({
  selector: 'app-user-list-form',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgbInputDatepicker,
    NgbTypeahead,
    InputValidationDirective,
  ],
  templateUrl: './user-list-form.component.html',
  styleUrl: './user-list-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListFormComponent {
  protected readonly userListForm: FormArray<FormGroup<UserGroup>> =
    this.getUserListForm();
  protected timerTime: number = 0;

  private isFormPreparedToSubmit: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private readonly maxFormsCount: number = 10;
  private readonly defaultTimerSec: number = 20;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly userApiService: UserApiService,
    private readonly availableUsernameValidator: AvailableUsernameValidator,
    private readonly birthdayValidator: BirthdayValidator,
    private readonly countryValidator: CountryValidator,
    private readonly destroyRef: DestroyRef,
  ) {}

  public get isLessThanMaxFormsCount() {
    return this.userListForm.controls.length < this.maxFormsCount;
  }

  public get isUserListFormDisabled() {
    return this.userListForm.disabled;
  }

  public get isUserListFormInvalid() {
    return this.userListForm.invalid;
  }

  public addUserGroup() {
    this.userListForm.push(this.getUserFormGroup());
  }

  public onSubmit(): void {
    this.prepareFormToSubmit();
    const submitSubscription = combineLatest([
      this.isFormPreparedToSubmit,
      timer(0, 1000),
    ]).pipe(
      tap(([isSubmitAction, iteration]) => {
        this.timerTime = (this.defaultTimerSec - iteration - 1) * 1000;
        this.cdr.markForCheck();
      }),
      take(this.defaultTimerSec),
      takeWhile(([submitAction]) => submitAction),
      takeUntilDestroyed(this.destroyRef),
    );

    submitSubscription.subscribe({
      complete: () => {
        this.completeFormSubmit();
      },
    });
  }

  public onCancel(): void {
    this.isFormPreparedToSubmit.next(false);
  }

  protected readonly searchCountry: OperatorFunction<
    string,
    readonly string[]
  > = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchText) =>
        searchText.length < 1
          ? []
          : COUNTRIES_LIST.filter(
              (country) =>
                country.toLowerCase().indexOf(searchText.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );

  private getUserFormGroup(): FormGroup<UserGroup> {
    return this.fb.group<UserGroup>({
      country: this.fb.control(null, {
        updateOn: 'blur',
        validators: [
          Validators.required,
          this.countryValidator.validate.bind(this.countryValidator),
        ],
      }),
      username: this.fb.control(null, {
        updateOn: 'change',
        validators: [Validators.required],
        asyncValidators: [
          this.availableUsernameValidator.validate.bind(
            this.availableUsernameValidator,
          ),
        ],
      }),
      birthday: this.fb.control(null, {
        validators: [
          Validators.required,
          this.birthdayValidator.validate.bind(this.birthdayValidator),
        ],
        updateOn: 'change',
      }),
    });
  }

  private getUserListForm(): FormArray<FormGroup<UserGroup>> {
    return this.fb.array([this.getUserFormGroup()]);
  }

  private prepareFormToSubmit() {
    this.isFormPreparedToSubmit.next(true);
    this.userListForm.disable();
  }

  private completeFormSubmit() {
    this.timerTime = 0;
    this.userListForm.enable();
    if (this.isFormPreparedToSubmit.value) {
      this.userApiService
        .sendUsersData(this.userListForm.value as UserGroupValue[])
        .subscribe((response) => {
          console.log(response);
        });
      this.userListForm.clear();
      this.addUserGroup();
    }
  }
}
