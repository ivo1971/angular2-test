import { Component, OnInit, ViewChild} from '@angular/core';

import { Observable }                  from 'rxjs/Observable';
import { Subject }                     from 'rxjs/Subject';

import 'rxjs/add/operator/do';

import { InfiniteScroll }              from './infinite-scroll/infinite-scroll';

import { ProcessGroup }                from './process-group';
import { ProcessGroupDetailComponent } from './process-group-detail.component';
import { ProcessGroupService }         from './process-group.service';

@Component({
  selector: 'process-group-list',
  directives: [ProcessGroupDetailComponent, InfiniteScroll ],
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
	  this.processGroups = this.processGroupsService.getProcessGroups();
  }

  public onNext() {
    this.processGroupsService.loadProcessGroups();
  }

  public onScroll() {
    console.log("onScroll");
    this.processGroupsService.loadProcessGroups();
  }
}