import { Component}                    from '@angular/core';
import { ROUTER_DIRECTIVES }           from '@angular/router';

import { ProcessGroupService }         from './process-group.service';

import { AuthenticatedDirective }      from './authenticated.directive';

import { AuthComponent }               from './authenticate.component';
import { HomeComponent }               from './home.component';
import { ProcessGroupListComponent }   from './process-group-list.component';
import { SchedulerListComponent }      from './scheduler-list.component';
import { TopMenuComponent }            from './top-menu.component';

@Component ({
    selector: "bm-app",
    templateUrl: "app/app.component.html",
    directives: [ROUTER_DIRECTIVES, AuthComponent, AuthenticatedDirective, TopMenuComponent],
    providers: [ProcessGroupService],
    precompile: [AuthComponent, HomeComponent, ProcessGroupListComponent, SchedulerListComponent],
})
export class AppComponent {
    public title = "BM application";
}