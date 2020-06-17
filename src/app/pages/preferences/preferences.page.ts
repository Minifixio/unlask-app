import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {

  notificationActive = true;
  questionsAmount = '01';

  constructor(
    private notificationService: NotificationsService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.storageService.getNotificationPref().then(res => this.notificationActive = res);
    this.storageService.getQuestionAmountPref().then(res => this.questionsAmount = String(res).padStart(2, '0'));
  }

  async notificationPref(event: CustomEvent) {
    this.notificationActive = event.detail.checked;
    if (event.detail.checked) {
      await this.notificationService.enableNotification();
    } else {
      await this.notificationService.disableNotification();
    }
  }

  async questionAmountPref(event: CustomEvent) {
    this.questionsAmount = event.detail.value;
    await this.storageService.setQuestionAmountPref(Number(event.detail.value));
  }

}
