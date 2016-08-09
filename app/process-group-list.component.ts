import { Component, OnInit, ViewChild} from '@angular/core';

import { Observable }                  from 'rxjs/Observable';
import { Subject }                     from 'rxjs/Subject';

import 'rxjs/add/operator/do';

import { ProcessGroup }                from './process-group';
import { ProcessGroupDetailComponent } from './process-group-detail.component';
import { ProcessGroupService }         from './process-group.service';
import { IsVisibleDirective}           from './is-visible.directive';

@Component({
  selector: 'process-group-list',
  directives: [ProcessGroupDetailComponent, IsVisibleDirective],
  templateUrl: 'app/process-group-list.component.html',
})
export class ProcessGroupListComponent implements OnInit { 
  public title: string = 'Process groups';
  public processGroups: Observable<ProcessGroup[]>;
  public errorMessage: string;
  public requestCheck: number = 0;

  constructor(private processGroupsService: ProcessGroupService) {
  }

  ngOnInit() {
    this.getProcessGroups();  
  }

  private getProcessGroups() {
	  this.processGroups = this.processGroupsService.getProcessGroups()
      .do(e => ++this.requestCheck); //inform the scroll-event-directive that items have been loaded 
                                     //which actually occurs before the drawing --> so probably this will always trigger a second load
  }

  public onNext() {
    this.processGroupsService.loadProcessGroups();
  }

  public isVisible() {
    console.log("isVisible caugth");
    this.processGroupsService.loadProcessGroups();
  }  
}