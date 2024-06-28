import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserGroupValue } from '../models/user-group.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient) {}

  checkUser(username: string): Observable<boolean> {
    return this.http
      .post<{ isAvailable: boolean }>('/api/checkUsername', {
        username,
      })
      .pipe(map((response) => response.isAvailable));
  }

  sendUsersData(formValue: UserGroupValue[]) {
    return this.http.post<{}>('/api/submitForm', { formValue });
  }
}
