/*  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This program was inspired by:
 * - https://coryrylan.com/blog/angular-2-observable-data-services
 * - http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
 */
import { Injectable }                                                            from '@angular/core';
import { Http, Request, Response, RequestOptions, ConnectionBackend, XHRBackend} from '@angular/http';
import { Observable }                                                            from 'rxjs/Observable';
import { Subject }                                                               from 'rxjs/Subject';
import { BehaviorSubject }                                                       from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/catch';

import {HttpInterceptorService}                                                  from './http-interceptor.service'

/* Extends the HttpInterceptorService with a function to send authentication
 * requests. The service pre-parses the response to get the authentication token
 * from it and send it to the HttpInterceptorService.
 */
@Injectable()
export class HttpInterceptorAuthenticateService extends HttpInterceptorService {
    private token: string = "";

    /* Constructor: the basic prototype is identical to the http constructor,
     * extended with some specific parameters.
     */
    constructor(private backendAuth: ConnectionBackend, private defaultOptionsAuth: RequestOptions, private signInUrl: string) {
        super(backendAuth, defaultOptionsAuth, signInUrl);
    }

    /**
     * Sign in.
     */
    public authenticate(req: any, store?: boolean) : Observable<any> {
        return this.post(this.signInUrl, JSON.stringify(req))
            .map(
                //parse the token from the authenticate response,
                //then forward the response as it came in
                res => {
                    let body = res.json();
                    this.token = body.data.token || "";
                    if(0 != this.token.length) {
                        this.setAuthenticationOk(this.token, store);
                    }
                    return res;
                }
            )
            .catch(
                error => {
                    //no need to inform HttpInterceptor: since we are sending sign-in requests the interceptor is already aware
                    //that we are currently not signed in.
                    this.token = ""; //probably also not necessary, but easy to do and avoids potential issues.

                    //handle error
                    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Unknwon server error';
                    return Observable.throw(errMsg);
                }
            );
    }
}

/* Export a function that returns a provider for the HttpInterceptorAuthService
 */
export function httpInterceptorAuthenticateServiceProvider(signInUrl: string) : any[] {
  return [{
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions) => new HttpInterceptorAuthenticateService(xhrBackend, requestOptions, signInUrl),
      deps: [XHRBackend, RequestOptions]
    }];
}
