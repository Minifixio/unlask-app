import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-set-selection',
  templateUrl: './set-selection.page.html',
  styleUrls: ['./set-selection.page.scss'],
})
export class SetSelectionPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  newSet() {
    const navigationExtras: NavigationExtras = {
      state: {
        set: null
      }
    };
    this.router.navigate(['set-edition'], navigationExtras);
  }

  editSet(setId: number) {
    const navigationExtras: NavigationExtras = {
      state: {
        set: setId
      }
    };
    this.router.navigate(['set-edition'], navigationExtras);
  }
}
