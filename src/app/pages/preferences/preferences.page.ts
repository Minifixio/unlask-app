import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {

  notificationActive: boolean;

  constructor(
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
  }

  async notificationPref(event: CustomEvent) {
    if (event.detail.checked) {
      await this.notificationService.enableNotification();
    } else {
      await this.notificationService.disableNotification();
    }
  }

}
