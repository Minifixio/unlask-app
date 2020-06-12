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

  questionSets: Promise<QuestionSet[]>;

  constructor(
    private platform: Platform,
    private router: Router,
    private storageService: StorageService,
    private dbService: DatabaseService,
    private tabsPage: TabsPage
  ) { }

  ngOnInit() {
    this.tabsPage.pageChange.subscribe((route) => { if (route === '/tabs/selection') { this.refresh(); }});
  }

  ionViewDidEnter() {
    this.refresh();
  }

  refresh() {
    if (this.platform.is('cordova')) {
      this.dbService.initDB().then(() => {
        this.dbService.getRandomQuestions().then(res => console.log(res));
        this.questionSets = this.dbService.getSets();
        console.log(this.questionSets);
      });
    }
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
