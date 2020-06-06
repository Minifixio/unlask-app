import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { NotificationsService } from '../services/notifications.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { AlertController } from '@ionic/angular';

declare var cordova: any;
declare var window: any;
declare var navigator: any;
declare var mayflower: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


  unlockTask: any;

  constructor(
    public platform: Platform,
    private http: HttpClient,
    private powerManagement: PowerManagement,
    private notifService: NotificationsService,
    private backgroundMode: BackgroundMode,
    private dialogs: Dialogs
  ) {
    this.initApp();
  }

  async ionViewDidEnter() {
    console.log('entered');

    if (cordova) {
      this.subUnlockEvent('init');
    }
  }

  initApp() {

    this.platform.ready().then(() => {

      this.notifService.stickNotification();

      this.unlockTask = setInterval(() => {
        const date = new Date();
        this.subUnlockEvent('init-interval' + date.toUTCString());
      }, 3000);

      this.powerManagement.acquire()
      .then(() => {
        console.log('Wakelock acquired');
      })
      .catch(() => {
        console.log('Failed to acquire wakelock');
      });

      this.powerManagement.setReleaseOnPause(false)
      .then(() => {
        console.log('setReleaseOnPause successfully');
      })
      .catch(() => {
        console.log('Failed to set');
      });
    });
  }

  test() {

    // mayflower.moveTaskToBack();
    console.log(cordova.plugins);
    this.subUnlockEvent('init-exit');
  }

  async subUnlockEvent(message: string) {

    cordova.plugins.ScreenEvents.listenerInit(async (msg) => {
      // this.backgroundMode.moveToForeground();
      window.plugins.bringtofront();
      this.dialogs.confirm('Hello', 'Hello').then((num) => {
        mayflower.moveTaskToBack();
      });
    });
    await this.postEvent('event', message);
  }

  async postEvent(url, event: string) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = { headers };

    return await this.http.post(`http://192.168.10.18:2000/` + url, {event}, options).toPromise();
  }

}
