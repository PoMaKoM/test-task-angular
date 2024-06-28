import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MockBackendInterceptor} from "./shared/mock-backend/mock-backend.interceptor";
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UserListFormComponent} from "./features/users/components/user-list-form/user-list-form.component";
import {CustomDateParserFormatter} from "./features/users/services/test.service";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterOutlet,
        NgbModule,
        UserListFormComponent
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
        {provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true}
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
