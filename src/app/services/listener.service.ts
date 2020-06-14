import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import BackgroundFetch from 'cordova-plugin-background-fetch';

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
    private router: Router,
  ) {}

  startListening() {
    setTimeout(() => {
      BackgroundFetch.configure(
        async (taskId) => {
          console.log('[BackgroundFetch] taskId: ', taskId);

          this.listenTask = setInterval(() => {
            const date = new Date();
            this.httpService.postEvent('Interval occured at ' + date.toUTCString());
            this.subUnlockEvent();
          }, 3000);
        },
        () => {
          console.log('Background error');
        },
        {
          minimumFetchInterval: 15,
          startOnBoot: true
        }
      );

      this.listenTask = setInterval(() => {
        const date = new Date();
        this.httpService.postEvent('Interval occured at ' + date.toUTCString());
        this.subUnlockEvent();
      }, 3000);

      this.powerManagement.acquire()
      .then(() => {
        console.log('Wakelock acquired');
      })
      .catch((e) => {
        console.log(e);
        console.log('Failed to acquire wakelock');
      });

      this.powerManagement.setReleaseOnPause(false)
      .then(() => {
        console.log('setReleaseOnPause successfully');
      })
      .catch(() => {
        console.log('Failed to set');
      });
    }, 1000);

  }

  async subUnlockEvent() {

    cordova.plugins.ScreenEvents.listenerInit(async (event: string) => {
      window.plugins.bringtofront();
      await this.platform.ready();
      await this.router.navigateByUrl('/question');
      await this.httpService.postEvent(event);
    });
  }
}
