import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CityworksSrResponse } from './cityworks-sr-response';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CityworksAuthResponse } from './cityworks-auth-response';
import { CityworksValidateTokenResponse } from './cityworks-validate-token-response';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityworksService {

  constructor(private http: HttpClient) { }

  // private tstToken = environment.token;
  // private cwAuthUrl = `https://cityworkstest.raleighnc.gov/backdoor/services/General/Authentication/Authenticate`;
  // private cityworksSRUrl = 'https://cityworkstest.raleighnc.gov/backdoor/Services/AMS/ServiceRequest/';
  // private cityworksAddToReqUrl = 'https://cityworkstest.raleighnc.gov/admin/services/Ams/CustomerCall/AddToRequest/';
  private cityworksSRUrl = 'https://cityworks.raleighnc.gov/admin/Services/AMS/ServiceRequest/';
  private cwAuthUrl = `https://cityworks.raleighnc.gov/admin/services/General/Authentication/Authenticate`;
  private cityworksAddToReqUrl = 'https://cityworks.raleighnc.gov/admin/services/Ams/CustomerCall/AddToRequest/';

  // validateToken(): Observable<CityworksValidateTokenResponse> {
  //   const params = new HttpParams()
  //     .append('data', JSON.stringify(this.tstToken));

  //   return this.http.post<CityworksValidateTokenResponse>(this.cwValTokenUrl, null, {
  //     params
  //   }).pipe(
  //     catchError(this.handleError));
  // }

  getToken(): Observable<CityworksAuthResponse> {
    const login = { LoginName: environment.user, Password: environment.password };
    // , environment.Password}
    const params = new HttpParams()
      .append('data', JSON.stringify(login));

    return this.http.post<CityworksAuthResponse>(this.cwAuthUrl, null, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  createServiceRequest(request, token): Observable<CityworksSrResponse> {

    const params = new HttpParams()
      .append('token', token).append('data', JSON.stringify(request));

    // body parameter is null since all data is in url parameters aka HttpParams
    return this.http.post<CityworksSrResponse>(`${this.cityworksSRUrl}Create`, null, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  addToRequest(request, token): Observable<CityworksSrResponse> {

    const params = new HttpParams()
      .append('token', token).append('data', JSON.stringify(request));

    // body parameter is null since all data is in url parameters aka HttpParams
    return this.http.post<CityworksSrResponse>(`${this.cityworksAddToReqUrl}`, null, {
      params
    }).pipe(
      catchError(this.handleError));
  }

  getServiceRequest(requestId, token): Observable<CityworksSrResponse> {

    const params = new HttpParams()
      .append('token', token).append('data', JSON.stringify(requestId));

    return this.http.post<CityworksSrResponse>(`${this.cityworksSRUrl}ById`, null, {
      params
    }).pipe(
      catchError(this.handleError));

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
