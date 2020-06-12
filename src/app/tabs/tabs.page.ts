import { Component, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  pageChange: Subject<any>;

  constructor(
    private router: Router
  ) {
    this.pageChange = new Subject();
  }

  ionViewDidEnter() {
    console.log('here');
    console.log(this.router.url);
    this.pageChange.next(this.router.url);
  }
}
