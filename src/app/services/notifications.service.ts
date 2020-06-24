import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private localNotifications: LocalNotifications,
    private storageService: StorageService,
    private router: Router,
    private platform: Platform
  ) { }

  async init() {
    const activated = await this.storageService.getNotificationPref();

    if (activated) {
      console.log('Notificaitons are activated');
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
        title: `UNLASK APP`,
        text: 'Click to disable it',
        smallIcon: 'res://transparent_icon',
        sticky: true,
        foreground: true,
        lockscreen: false,
        priority: -2,
        led: false
      });

      this.localNotifications.on('click').subscribe(async (e) => {
        if (e.id === 1) {
          await this.platform.ready();
          await this.router.navigateByUrl('/tabs/preferences');
        }
      });
  }

  async enableNotification() {
    await this.storageService.setNotificationPref(true);
    await this.stickNotification();
  }

  async disableNotification() {
    await this.storageService.setNotificationPref(false);
    await this.clearNotifications();
  }

  async clearNotifications() {
    await this.localNotifications.clear(1);
  }

}
