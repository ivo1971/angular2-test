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
 * - http://stackoverflow.com/questions/37971019/angular-2-detect-scroll-event-from-inner-div
 */
import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

/* This directive emits events whenever it detects that it is visible
 * in the browser view. Triggers for detection:
 * - window scroll events;
 * - window resize events;
 * - set requestCheck output parameter of this directive.
 *   This is required as there is no DOM event to detect position
 *   changes of an element. The only other way seems to be polling,
 *   which is inefficient. So instead this directive choses to let
 *   the parent inform it of changes and let the parent request an
 *   additional check.
 */
@Directive({
    selector: '[is-visible]',
    host: {
        '(window:scroll)': 'eventTrack()',
        '(window:resize)': 'eventTrack()',
    },
})
export class IsVisibleDirective implements OnInit {
    private firstRequestCheck: boolean = true;
    //this input sets an additional offset (pixels) on the view size,
    //as long as the directive falls within this offset it will emit
    //'visible' events.
    @Input('is-visible') offset: any = 0;
    //this input lets the parent explicitely request a new check
    //whenever it is aware that something changed.
    @Input() set requestCheck(dummy: number) {
        //console.log("check [" + dummy + "]");
        if(this.firstRequestCheck) {
            //avoid an event due to the initialisation of the data-binding
            console.log("check [" + dummy + "] avoid first");
            this.firstRequestCheck = false;
            //window.scrollTo(0, 0);
            //document.documentElement.scrollTop = document.body.scrollTop = 0;
            return;
        }
        var d = document;
        //console.log("check [" + d.body.scrollHeight + "]["+ d.documentElement.scrollHeight + "]");
        //console.log("check [" + d.body.offsetHeight + "]["+ d.documentElement.offsetHeight + "]");
        //console.log("check [" + d.body.clientHeight + "]["+ d.documentElement.clientHeight + "]");
        if(d.body.clientHeight >= d.documentElement.clientHeight) {
            console.log("request check [" + dummy + "] emit event");
	        window.scrollTo(0, 0);
            this.emitEvent();
        }
    }

    //event emitted by the directive whenever it detects that its parent element in the DOM
    //is still inside the visible area in the browser
    @Output() isVisible = new EventEmitter();

    //get a reference to the DOM element that is the parent of the directive
    constructor(private element: ElementRef) {
    }
    ngOnInit() {
    }

    //calculate the heifht of the complete document containing the complete DOM
    private getDocHeight() {
        var d = document;
        return Math.max(
            d.body.scrollHeight, d.documentElement.scrollHeight,
            d.body.offsetHeight, d.documentElement.offsetHeight,
            d.body.clientHeight, d.documentElement.clientHeight
        );
    }

    //calculate the height of the view (the visible area) in the browser
    private getClientHeight() {
        var d = document;
        return Math.max(
            d.body.clientHeight//, d.documentElement.clientHeight
        );
    }

    private emitEvent() {
        this.isVisible.emit({
            isVisible: true
        });
    }

    //check that an isVisible event should be emitted and do so whenever
    //this is necesarry.
    private handler() {
        var clientHeight = this.getClientHeight() + parseInt(this.offset); //get info about the view in the browser and add a configurable offset which configures pre-loading
        var rect = this.element.nativeElement.getBoundingClientRect(); //rectangle around the directive element
        //console.log("handler [" + rect.top + "][" + clientHeight + "]");
        var d = document;
        //console.log("check [" + d.body.scrollHeight + "]["+ d.documentElement.scrollHeight + "]");
        //console.log("check [" + d.body.offsetHeight + "]["+ d.documentElement.offsetHeight + "]");
        //console.log("check [" + d.body.clientHeight + "]["+ d.documentElement.clientHeight + "]");
        //console.log("check [" + window.scrollY + "][" + window.innerHeight + "][" + window.outerHeight + "]");
        var a: number = window.scrollY;
        var b: number = d.body.scrollHeight - d.body.clientHeight;
        var c: number = (a * 100) / b;
        var d: number = b - a;
        console.log("check [" + d + "][" + c + "][" + a + "][" + b + "]");
        if(d < this.offset) {
            //directive is visible --> emit event (e.g. to request more data from the server)
            //console.log("handler visible [" + rect.top + "][" + clientHeight + "][" + this.offset + "]");
            this.emitEvent();
        }
    }

    //the host-decorator of this directive binds
    //this function to several events. Whenever these
    //events occur, the 'handler' is called to check that an event
    //shoud be emitted.
    public eventTrack() {
        this.handler();
    }
}
