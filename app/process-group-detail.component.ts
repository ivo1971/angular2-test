import { Component, Input } from '@angular/core';
import {ProcessGroup} from './process-group';

@Component({
    selector: 'process-group-detail',
    template: '<span *ngIf="processGroup">{{processGroup.groupId}} - {{processGroup.description}}</span>',
})
export class ProcessGroupDetailComponent {
    @Input()
    processGroup: ProcessGroup;
}