/* inspiration sources:
 * - https://coryrylan.com/blog/angular-2-observable-data-services
 * - http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
 */
import { Injectable }      from '@angular/core';
import { Http, Response }  from '@angular/http';
import { Observable }      from 'rxjs/Observable';
import { Subject }         from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/catch';

import { ProcessGroup }    from './process-group';

@Injectable()
export class ProcessGroupService {
    private processGroupUrl                                = 'api/processGroups';
    private processGroupInitDone: boolean                  = false;
    private processGroup$: BehaviorSubject<ProcessGroup[]> = new BehaviorSubject([]);
    private processGroup: ProcessGroup[]                   = [];
    private isLoading: boolean                             = false; //ensure only 1 load-request is being executed at the same time

    constructor(private http: Http) {
        //console.log("ProcessGroupService construct");
    }

    public getProcessGroups() : Observable<ProcessGroup[]> {
        //console.log("ProcessGroupService getProcessGroups");
        if(!this.processGroupInitDone) {
            //console.log("ProcessGroupService getProcessGroups init not done");
            this.processGroupInitDone = true;
            this.loadProcessGroups();
        }
        return this.processGroup$.asObservable();
    }

    public loadProcessGroups() {
        //console.log("ProcessGroupService loadProcessGroups");
        if(this.isLoading) {
            //console.log("ProcessGroupService loadProcessGroups already");
            return;
        }
        this.isLoading = true;
	    this.http.get(this.processGroupUrl).map(
            response => response.json()).subscribe(
                data => {
                    console.log("ProcessGroupService loadProcessGroups received data:");
                    console.log(data);
                    this.processGroup.push.apply(this.processGroup, data.data);
                    this.processGroup$.next(this.processGroup);
                    this.isLoading = false;
                    //console.log("ProcessGroupService loadProcessGroups done");
                }, 
                error => {
                    console.log('Could not load process groups.');
                    this.isLoading = false;
                    //console.log("ProcessGroupService loadProcessGroups done (error)");
                }
            )
    }
}
