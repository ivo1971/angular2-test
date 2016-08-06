/* Inspiration:
 * - http://sixrevisions.com/css/fixed-navigation-bar/
 * - http://www.w3schools.com/howto/howto_css_dropdown.asp
 */
import { Component }           from '@angular/core';
import { ROUTER_DIRECTIVES }   from '@angular/router';

class MenuItem {
    constructor(public description: string, 
                public link?: string, 
                public subMenuItems?: MenuItem[]
                ) {
    }
}
@Component({
    directives: [ROUTER_DIRECTIVES],
    selector:    'top-menu',
    styleUrls:   ['app/top-menu.component.css'],
    templateUrl: 'app/top-menu.component.html',
})
export class TopMenuComponent { 
    menuItems: MenuItem[] = [
        new MenuItem("Home",               "Home"             ),
        new MenuItem("Schedules",          null,              [
            new MenuItem("Processes", "SchedulerList"),
            new MenuItem("Test",      "SchedulerList")
            ]),
        new MenuItem("Process group list", "ProcessGroupList" ),
    ];

    public getLink(menuItem: MenuItem) {
        return "/"+ menuItem.link;
    }
}