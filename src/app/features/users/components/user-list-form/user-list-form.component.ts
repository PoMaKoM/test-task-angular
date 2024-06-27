import {ChangeDetectionStrategy, Component, DestroyRef} from '@angular/core';
import {AddUserGroupComponent} from "../add-user-group/add-user-group.component";
import {DatePipe} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbInputDatepicker, NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {UserApiService} from "../services/user-api.service";
import {Country} from "../shared/enum/country";
import {UserGroup} from "../features/users/models/user-group.model";

const DEFAULT_TIMER: number = 20;
const COUNTRIES: string[] = Object.values(Country);


@Component({
    selector: 'app-user-list-form',
    standalone: true,
    imports: [
        AddUserGroupComponent,
        DatePipe,
        ReactiveFormsModule,
        NgbInputDatepicker,
        NgbTypeahead
    ],
    templateUrl: './user-list-form.component.html',
    styleUrl: './user-list-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListFormComponent {

    userListForm: FormArray<FormGroup<UserGroup>> = this.getUserListForm();

    constructor(
        private readonly fb: FormBuilder,
        private userApiService: UserApiService,
        private destroyRef: DestroyRef) {
    }

    private getUserFormGroup(): FormGroup<UserGroup> {
        return this.fb.group<UserGroup>({
            country: this.fb.control(null, [Validators.required]),
            username: this.fb.control(null, [Validators.required]),
            birthday: this.fb.control(null, [Validators.required]),
        })
    }

    private getUserListForm(): FormArray<FormGroup<UserGroup>> {
        return this.fb.array([this.getUserFormGroup()])
    }
}

//
// items: any[] = [{id: 0}, {id: 1}];
// isFormSubmit: WritableSignal<boolean> = signal(false);
// counterIterations = computed(() => {
//     if (this.isFormSubmit()) {
//         return toSignal(interval(1000), {initialValue: 0})
//     }
//     return signal(DEFAULT_TIMER);
// });
// timerView: number = 0;
// // sub: Observable<any> = combineLatest([this.isFormSubmit, timer(0, 1000)]).pipe(
// //     tap(([isSubmitAction, iteration]) => {
// //         this.timerView = (this.DEFAULT_TIMER - iteration - 1) * 1000;
// //         this.cdr.markForCheck();
// //     }),
// //     take(20),
// //     takeWhile(([submitAction, iteration]) => submitAction),
// //     takeUntilDestroyed(this.destroyRef),
// // )
//
// ngOnInit(): void {
//     effect(() => {
//         if (this.counterIterations()() < 20) {
//
//         }
//     });
// }
//
// addForm() {
//     this.items.push({id: Math.random()})
// }
//
// submitForm() {
//     this.isFormSubmit.set(true);
//     // this.sub.subscribe({
//     //     complete: () => {
//     //         this.timerView = 0;
//     //         if (this.submitAction()) {
//     //             //todo
//     //             console.log('send request');
//     //         }
//     //     }
//     // });
// }
//
// cancelSubmit() {
//     this.isFormSubmit.set(false);
// }
//
//
// country = new FormControl('');
// username = new FormControl('');
// birthday = new FormControl('');
//
// search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
//     text$.pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         map((term) =>
//             term.length < 1 ? [] : COUNTRIES.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
//         ),
//     );
