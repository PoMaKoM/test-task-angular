import { FormControl } from '@angular/forms';
import { COUNTRY } from '../../../shared/enum/country';

export interface UserGroup {
  country: FormControl<COUNTRY | null>;
  username: FormControl<string | null>;
  birthday: FormControl<Date | null>;
}

export interface UserGroupValue {
  country: COUNTRY;
  username: string;
  birthday: Date;
}
