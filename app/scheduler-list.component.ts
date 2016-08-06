import { Component, Input } from '@angular/core';

@Component({
    selector: 'schedulerlist',
    template: '<h2>{{title}}</h2>',
})
export class SchedulerListComponent {
    public title: string = "Scheduler list TODO";
}