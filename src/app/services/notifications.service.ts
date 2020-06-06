import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private localNotifications: LocalNotifications
  ) {
    this.stickNotification();
   }


  async stickNotification() {
    const hasPermission = await this.localNotifications.hasPermission();

    if (hasPermission === false) {
      this.localNotifications.requestPermission();
    }

    this.localNotifications.schedule({
      id: 1,
      title: 'Unlock app is running',
      sticky: true,
      foreground: true,
      priority: -2
    });
  }

  dismissNotificaiton() {
    this.localNotifications.clear(1);
  }
}
