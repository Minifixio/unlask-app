import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private localNotifications: LocalNotifications,
    private storageService: StorageService
  ) { }

  async init() {
    const activated = await this.storageService.getNotificationPref();

    if (activated) {
      try {
        await this.stickNotification();
      } catch (e) {
        console.log('error while setting notification');
      }
    }
  }

   async stickNotification() {
      let hasPermission = await this.localNotifications.hasPermission();

      await this.localNotifications.clearAll();
      if (hasPermission === false) {
        hasPermission = await this.localNotifications.requestPermission();
      }

      if (!hasPermission) {
        return;
      }

      this.localNotifications.schedule({
        id: 1,
        title: 'Unlask app is running',
        smallIcon: 'res://transparent_icon',
        sticky: true,
        foreground: true,
        lockscreen: false,
        priority: -2,
        led: false
      });
  }

  async enableNotification() {
    await this.storageService.setNotificationPref(true);
    await this.stickNotification();
  }

  async disableNotification() {
    await this.storageService.setNotificationPref(false);
    await this.localNotifications.clear(1);
  }

}
