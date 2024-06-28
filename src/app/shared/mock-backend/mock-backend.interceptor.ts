import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { COUNTRY } from '../enum/country';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    console.log(`Intercepted request: ${req.url}`);

    const countryRegion = {
      [COUNTRY.AUSTRALIA]: 'Australia',
      [COUNTRY.POLAND]: 'Europe',
      [COUNTRY.UKRAINE]: 'Europe',
      [COUNTRY.AUSTRIA]: 'Europe',
      [COUNTRY.USA]: 'America',
      [COUNTRY.MEXICO]: 'America',
      [COUNTRY.NEPAL]: 'Asia',
    };

    // Intercept requests and return mock responses
    if (req.url.endsWith('/api/regions') && req.method === 'POST') {
      const { country }: { country: COUNTRY } = req.body;
      return of(
        new HttpResponse({
          status: 200,
          body: { region: countryRegion[country] },
        }),
      );
    }
    if (req.url.endsWith('/api/checkUsername') && req.method === 'POST') {
      const { username } = req.body;
      return of(
        new HttpResponse({
          status: 200,
          body: { isAvailable: username.includes('new') },
        }),
      );
    }
    if (req.url.endsWith('/api/submitForm') && req.method === 'POST') {
      return of(
        new HttpResponse({ status: 200, body: { result: 'nice job' } }),
      );
    }

    return of(
      new HttpResponse({
        status: 404,
        body: { result: 'You are using the wrong endpoint' },
      }),
    );
  }
}
