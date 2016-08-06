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
import { Directive, ElementRef }                       from '@angular/core';
import { Http }                                        from '@angular/http';

import { HttpInterceptorService, HttpInterceptorInfo } from './http-interceptor.service';

/* The directive can be used on eny element to hide the element
 * when we are currently not authenticated.
 */
@Directive({ 
    selector: '[authenticated-visible]' 
})
export class AuthenticatedDirective {
    //providers
    private httpInterceptorService: HttpInterceptorService; //cannot be a constructor parameter due to the required downcast

    /**
     * Constructor
     */	
    constructor(private el: ElementRef, private http: Http) {
        //initialisation: hide
	    el.nativeElement.style.visibility = 'hidden';

        //downcast according to https://dzone.com/articles/using-casting-typescript
        this.httpInterceptorService = <HttpInterceptorService>this.http;

        //get info about authentication status from the HttpInterceptor service
        this.httpInterceptorService.getInterceptorInfo$().subscribe(
            (httpInterceptorInfo: HttpInterceptorInfo) => {
	            el.nativeElement.style.visibility = httpInterceptorInfo.authenticationOk ? 'visible' : 'hidden';
            }
        );
    }
}
