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
 */
import { Component, Input }                   from '@angular/core';
import { Http }                               from '@angular/http';
import { Observable }                         from 'rxjs/Observable';

import { HttpInterceptorInfo }                from './http-interceptor.service';
import { HttpInterceptorAuthenticateService } from './http-interceptor-authenticate.service';

/* Help class to compose sign-in info as expected by the server
 * 
 */
class AuthenticateReq {
    constructor(public user: string, public password: string) {
    }
}

/* Authentication component.
 */
@Component({
    selector:    'authenticate',
    styleUrls:   ['app/authenticate.component.css', 'app/form.css'],
    templateUrl: 'app/authenticate.component.html',
})
export class AuthComponent {
    /**
     * Properties
     */
    //user info
    public user: string           = "";
    public password: string       = "";
    public rememberMe: boolean    = false;

    //form management info
    public submitted              = false; //sign-in form has been submitted by user, waiting for server response
    public authenticated          = false; //we are currently authenticated, no need to show the form
    public hasInfo                = false; //at least 1 time authentication info was received from the http service

    //providers
    private httpInterceptorAuthenticateService: HttpInterceptorAuthenticateService; //cannot be a constructor parameter due to the required downcast

    /**
     * Constructor
     */
    constructor(private http: Http) {
        //downcast according to https://dzone.com/articles/using-casting-typescript
        this.httpInterceptorAuthenticateService = <HttpInterceptorAuthenticateService>this.http;

        //get information about token storeage from the HttpInterceptor service
        this.rememberMe = this.httpInterceptorAuthenticateService.isTokenStored();

        //get info about authentication status from the HttpInterceptor service
        this.httpInterceptorAuthenticateService.getInterceptorInfo$().subscribe(
            httpInterceptorInfo => {
                    if(!httpInterceptorInfo.authenticationOk) {
                        this.authenticated = false;
                        this.hasInfo       = true;
                    }
                }
        )
    }

    /**
     * Handlers
     */
    public onSumbit() : void {
        this.submitted = true;
        let authenticateReq : AuthenticateReq = new AuthenticateReq(this.user, this.password);
	    this.httpInterceptorAuthenticateService.authenticate(authenticateReq, this.rememberMe)
                .subscribe(
                    (rsp: any) => {
                        //rsp without an error: sign-in is OK
                        this.authenticated = true;
                        this.submitted     = false;
                        this.user          = "";
                        this.password      = "";
                        //TODO: unsubscribe?
                    },
                    error => {
                        //security: don not reveal to the user what went wrong
                        this.authenticated = false;
                        this.submitted     = false;
                        this.user          = "";
                        this.password      = "";
                        //TODO: unsubscribe?
                    }
                );
    }
}