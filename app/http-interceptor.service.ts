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
 * - Angular 1 http-interception
 * - https://www.illucit.com/blog/2016/03/angular2-http-authentication-interceptor 
 * - http://stackoverflow.com/questions/34907151/handling-refresh-tokens-using-rxjs (flatmap)
 */
import { Injectable, provide } from '@angular/core';
import { Http, Request, RequestOptionsArgs, RequestMethod, RequestOptions, BaseRequestOptions, Response, ConnectionBackend, Headers, XHRBackend} from '@angular/http';
import { Observable }          from 'rxjs/Observable';
import { BehaviorSubject }     from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/filter';

/* Extend the JavaScript string class with a function
 * to check (return true) that the string on which the function
 * is called ends with the string provided as a parameter.
 */ 
String.prototype.endsWith = function (s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
} 

/* Class emitted by the HttpInterceptor when the authentication status
 * changed somehow.
 */
export class HttpInterceptorInfo {
    constructor(public authenticationOk: boolean = false, public token: string = "") {
    }

    public setOk(token: string) : void {
        this.authenticationOk = true;
        this.token            = token;
    }

    public setNotOk() : void {
        this.authenticationOk = false;
        this.token            = "";
    }
}

/* The HttpInterceptor extends the Angular base Http class:
 * it monitors all http responses and catches authentication errors on
 * them. In case of an authentication error, the service will wait
 * until authentication is OK again and then re-emits the request. To
 * the consumer of the response this is completely transparant.
 * It will emit HttpInterceptorInfo when the authentication status changes
 * somehow. Another component/service can use this as a trigger to
 * start a new authentication cylce.
 * When some other component/service managed to authenticate, it has to
 * inform the HttpInterceptor (setAuthenticationOk). 
 */
@Injectable()
export class HttpInterceptorService extends Http {
    /* Private members
     */
    private static get HEADER_KEY_TOKEN(): string { return "AuthenticationToken"; };
    private static get LOCALSTORAGE_KEY_TOKEN(): string { return "HttpInterceptorService-token"; };
    private httpInterceptorInfo: HttpInterceptorInfo = new HttpInterceptorInfo();
    private httpInterceptorInfo$: BehaviorSubject<HttpInterceptorInfo> = new BehaviorSubject(this.httpInterceptorInfo); //using BehaviorSubject ensures that information is imediately emitted when there is a new subsriber (initial value)
    private tokenStored: boolean = false;

    /* Constructor: the basic prototype is identical to the http constructor,
     * extended with some specific parameters.
     */
    constructor(private backend: ConnectionBackend, private defaultOptions: RequestOptions, private ignoreUrl: string) {
        super(backend, defaultOptions);

        //try to get a token from local storage
        if("undefined" !== typeof(Storage)) {
            let token = localStorage.getItem(HttpInterceptorService.LOCALSTORAGE_KEY_TOKEN);
            if((null != token) && (0 !== token.length)) {
                this.httpInterceptorInfo.setOk(token);
                this.tokenStored = true;
            }            
        }
    }

    /* Observable to which consumers can subsribe to get
     * updates of HttpInterceptornInfo.
     */
    public getInterceptorInfo$() : Observable<HttpInterceptorInfo> {
        return this.httpInterceptorInfo$.asObservable();
    }

    /* The module responsible for authentication informs us that 
     * authentication is OK. 
     */ 
    public setAuthenticationOk(token: string, store?: boolean) : void {
        this.httpInterceptorInfo.setOk(token);
        this.httpInterceptorInfo$.next(this.httpInterceptorInfo);

        //store token in local storage when this is requested
        if((null != store) && (store) && ("undefined" !== typeof(Storage))) {
            localStorage.setItem(HttpInterceptorService.LOCALSTORAGE_KEY_TOKEN, token);
            this.tokenStored = true;
        } else {
            this.tokenStored = false;
        }
    }

    public isTokenStored(): boolean {
        return this.tokenStored;
    }
 
    /* Overrides the base class call.
     */
    public request(url: string | Request, options: RequestOptionsArgs): Observable<Response> {
        if("Request" == url.constructor.toString()) {
            return this.intercept(<Request>url);
        } else {
            let request: Request = new Request(this.getRequestOptionArgs(<string>url, options.method, options));
            return this.intercept(request);
        }
    }
 
    /* Overrides the base class call.
     */
    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        let request: Request = new Request(this.getRequestOptionArgs(url, RequestMethod.Get, options));
        return this.intercept(request);
    }

    /* Overrides the base class call.
     */
    public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {   
        let request: Request = new Request(this.getRequestOptionArgs(url, RequestMethod.Post, options, body));
        return this.intercept(request);
    }
 
    /* Overrides the base class call.
     */
    public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        let request: Request = new Request(this.getRequestOptionArgs(url, RequestMethod.Put, options, body));
        return this.intercept(request);
    }
 
    /* Overrides the base class call.
     */
    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        let request: Request = new Request(this.getRequestOptionArgs(url, RequestMethod.Put, options));
        return this.intercept(request);
    }
    
    /* Replace the token header in the request with the provided value.
     */
    private requestUpdateToken(request: Request, token: string) : Request {
        request.headers.delete(HttpInterceptorService.HEADER_KEY_TOKEN);
        request.headers.append(HttpInterceptorService.HEADER_KEY_TOKEN, token);
        return request;
    }

    /* Compose the request headers.
     */
    private getRequestOptionArgs(url: string, method: string | RequestMethod, optionsArgs?: RequestOptionsArgs, body?: string) : RequestOptions {
        let options: RequestOptions = null == optionsArgs ? new RequestOptions() : new RequestOptions(optionsArgs);
        if(null == options.headers) {
            options.headers = new Headers();
        }
        options.headers.append('Content-Type',                          'application/json'            );
        options.headers.append('Accept',                                'application/json'            );
        options.headers.append(HttpInterceptorService.HEADER_KEY_TOKEN, this.httpInterceptorInfo.token);
        options.method = method;
        options.url    = url;        
        options.body   = body;        
        return options;
    }
    
    /* This function takes care of the actual respone interception
     * and authentication error detection and handling. 
     */
    private intercept(request: Request): Observable<Response> {
        return super.request(request).catch((err, source) => {
            if((401 == err.status) || (err.url.endsWith(this.ignoreUrl))) {
                //start (re-)authentication
                this.httpInterceptorInfo.setNotOk();
                this.httpInterceptorInfo$.next(this.httpInterceptorInfo);

                //wait until authentication has finished
                return this.getInterceptorInfo$()
                    .filter(function(data: HttpInterceptorInfo) {
                        return data.authenticationOk;
                    })
                    .flatMap((httpInterceptorInfo: HttpInterceptorInfo) => {
                        // retry with new token
                        return this.intercept(this.requestUpdateToken(request, httpInterceptorInfo.token)); //recurse (TODO: handle nested authentication errors correctly: now the data request seems to be returned finally multiple times...)
                    });
            } else {
                return Observable.throw(err);
            }
        });
    }
}

/* Export a function that returns a provider for the HttpInterceptor
 */
export function httpInterceptorServiceProvider(ignoreUrl: string) : any[] {
  return [{
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions) => new HttpInterceptorService(xhrBackend, requestOptions, ignoreUrl),
      deps: [XHRBackend, RequestOptions]
    }];
}
