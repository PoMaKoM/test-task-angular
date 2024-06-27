import {FormControl} from "@angular/forms";
import {Country} from "../../../shared/enum/country";

export interface UserGroup {
    country: FormControl<Country>,
    username: FormControl<string>,
    birthday: FormControl<Date>,
}