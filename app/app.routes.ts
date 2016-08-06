import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent }               from './home.component';
import { ProcessGroupListComponent }   from './process-group-list.component';
import { SchedulerListComponent }      from './scheduler-list.component';

const routes: RouterConfig = [
  {
    path: 'Home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'ProcessGroupList',
    component: ProcessGroupListComponent,
    pathMatch: 'full'
  },
  {
    path: 'SchedulerList',
    component: SchedulerListComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/Home',
    pathMatch: 'full'
  },  
];

export const appRouterProviders = [
  provideRouter(routes)
];