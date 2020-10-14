import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import {HttpService} from '../../../services/http.service';
import {smoothlyMenu} from '../../../app.helpers';

declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {

    sideBar: any;
    childBar: any = [];

    constructor(private router: Router,
                public http: HttpService
    ) {
        jQuery(document).ready(function () {

            jQuery('#sidebarCollapse').on('click', function () {
                jQuery('#sidebar').toggleClass('active');
            });

        });
        this.sideBar = http.CONSTANT.sideBarAdmin;
    }

    gotoUrl(url) {
        this.childBar = url.children;
        this.http.navigate(url.children[0].path, '');
    }

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();
        if (jQuery('body').hasClass('fixed-sidebar')) {
            jQuery('.sidebar-collapse').slimscroll({
                height: '100%'
            });
        }
    }

    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }

    toggleNavigation(): void {
        jQuery('body').toggleClass('mini-navbar ');
        smoothlyMenu();
    }

    hideSideBar() {
        if (jQuery(document).width() < 769) {
            this.toggleNavigation();
        }
    }

    onClickedOutside(e: Event) {
        if (jQuery(document).width() < 769) {
            // jQuery('body').addClass('body-small')
            this.toggleNavigation();
        }
        jQuery('body').toggleClass('mini-navbar ');
    }


}
