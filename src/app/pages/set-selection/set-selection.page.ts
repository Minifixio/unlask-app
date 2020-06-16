import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Question } from 'src/app/models/Question';
import { QuestionSet } from 'src/app/models/QuestionSet';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { TabsPage } from 'src/app/tabs/tabs.page';

@Component({
  selector: 'app-set-selection',
  templateUrl: './set-selection.page.html',
  styleUrls: ['./set-selection.page.scss'],
})
export class SetSelectionPage implements OnInit {

  questionSets: QuestionSet[];

  constructor(
    private platform: Platform,
    private router: Router,
    private storageService: StorageService,
    private dbService: DatabaseService,
    private tabsPage: TabsPage
  ) { }

  ngOnInit() {
    this.questionSets = [];
    this.tabsPage.pageChange.subscribe((route) => { if (route === '/tabs/selection') { this.refresh(); }});
  }

  ionViewDidEnter() {
    this.refresh();
  }

  refresh() {
    if (this.platform.is('cordova')) {
      this.dbService.initDB().then(() => {
        this.dbService.getSets().then(sets => {
          if (!this.compareSets(this.questionSets, sets)) {
            this.questionSets = sets;
          }
        });
      });
    } else {
      const questions: QuestionSet[] = [
        {
          set_id: 1,
          active: true,
          title: 'jlnfaifn aiufai ufamhfaifj afajfamiohfa',
          questions: [],
          amount: 4
        }
      ];
      this.questionSets = questions;
    }
  }

  compareSets(arr1: QuestionSet[], arr2: QuestionSet[]) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < arr1.length; i ++) {
      if (arr1[i].active !== arr2[i].active) {
        return false;
      }
      if (arr1[i].title !== arr2[i].title) {
        return false;
      }
      if (arr1[i].set_id !== arr2[i].set_id) {
        return false;
      }
      if (arr1[i].amount !== arr2[i].amount) {
        return false;
      }
    }

    return true;
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
