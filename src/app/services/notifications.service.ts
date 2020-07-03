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

      const timeRangeEnabled = await this.storageService.getTimeRangeEnabledPref();
      const appEnabled = await this.storageService.getEnabledPref();

      let timeRange: {start: string, end: string};
      let message: string;
      let title: string;

      if (timeRangeEnabled) {
        timeRange = await this.storageService.getTimeRangePref();
      }

      if (appEnabled) {
        title = 'UNLASK APP : Enabled';
        if (timeRange) {
          message = `Running from ${timeRange.start} to ${timeRange.end}`;
        } else {
          message = `Always running`;
        }
      } else {
        title = 'UNLASK APP : Disabled';
      }

      this.localNotifications.schedule({
        id: 1,
        title,
        text: message ? message : null,
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

  async updateTimeRange(start: string, end: string) {
    console.log(`Running from ${start} to ${end}`);
    this.localNotifications.update({
      id: 1,
      text: `Running from ${start} to ${end}`
    });
  }

  async disableTimeRange() {
    this.localNotifications.update({
      id: 1,
      text: `Always running`
    });
  }

  async updateAppSatus(status: boolean) {

    this.localNotifications.update({
      id: 1,
      title: status ? 'UNLASK APP : Enabled' : 'UNLASK APP : Disabled',
      text: ''
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
