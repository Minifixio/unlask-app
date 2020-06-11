import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

declare var cordova: any;
declare var window: any;
declare var mayflower: any;

@Injectable({
  providedIn: 'root'
})
export class ListenerService {

  listenTask: any;

  constructor(
    public platform: Platform,
    private httpService: HttpService,
    private powerManagement: PowerManagement,
    private dialogs: Dialogs,
    private router: Router
  ) {
    if (this.platform.is('android') || this.platform.is('cordova')) {
      this.startListening();
    }
  }

  startListening() {
    this.listenTask = setInterval(() => {
      const date = new Date();
      // this.httpService.postEvent('Interval occured at ' + date.toUTCString());
      this.subUnlockEvent();
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
  }

  async subUnlockEvent() {

    cordova.plugins.ScreenEvents.listenerInit(async (event: string) => {
      window.plugins.bringtofront();
      this.router.navigateByUrl('/question');
      // await this.httpService.postEvent(event);
    });
  }
}
