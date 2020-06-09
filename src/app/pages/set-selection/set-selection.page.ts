import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Question } from 'src/app/models/Question';
import { QuestionSet } from 'src/app/models/QuestionSet';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

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
    private dbService: DatabaseService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {

  }

  ionViewDidEnter() {
    console.log('enter')
    if (this.platform.is('cordova') || this.platform.is('android')) {
      this.dbService.initDB().then(() => {
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
