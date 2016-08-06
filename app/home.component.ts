import { Component } from '@angular/core';

@Component({
    selector: 'home',
    template: '<h2>{{title}}</h2>',
})
export class HomeComponent {
    public title : string = "Welcome";
}