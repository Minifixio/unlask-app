import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import BackgroundFetch from 'cordova-plugin-background-fetch';
import { StorageService } from './storage.service';

declare var cordova: any;
declare var window: any;
declare var mayflower: any;

@Injectable({
  providedIn: 'root'
})
export class ListenerService {

  listenTask: any;
  private readyApp!: () => void;
  private isAppInForeground: Promise<void> = Promise.resolve();

  constructor(
    public platform: Platform,
    private httpService: HttpService,
    private powerManagement: PowerManagement,
    private router: Router,
    private storageService: StorageService
  ) {}

  startListening() {
    console.log('Start listening');
    setTimeout(() => {
      BackgroundFetch.configure(
        async (taskId) => {
          console.log('[BackgroundFetch] taskId: ', taskId);

          this.listenTask = setInterval(() => {
            // const date = new Date();
            // this.httpService.postEvent('Interval occured at ' + date.toUTCString());
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

      this.platform.pause.subscribe(() => {
        this.isAppInForeground = new Promise(resolve => { this.readyApp = resolve; });
      });

      this.platform.resume.subscribe(() => {
        this.readyApp();
      });

    }, 500);
  }

  async subUnlockEvent() {

    cordova.plugins.ScreenEvents.listenerInit(async (event: string) => {
      this.storageService.getTimeRangeEnabledPref().then(async(pref) => {
        if (pref) {
          this.storageService.getTimeRangePref().then(async(range) => {
            const today = new Date();
            if (this.isInTimeRange(range.start, range.end, today.getHours(), today.getMinutes())) {
              window.plugins.bringtofront();
              await this.platform.ready();
              await this.isAppInForeground;
              await this.router.navigateByUrl('/question');
            }
          });
        } else {
          window.plugins.bringtofront();
          await this.platform.ready();
          await this.isAppInForeground;
          await this.router.navigateByUrl('/question');
        }
      });
      // await this.httpService.postEvent(event);
    });
  }

  stopListening() {
    BackgroundFetch.stop();
    clearInterval(this.listenTask);
  }

  isInTimeRange(start: string, end: string, currentHours: number, currentMinutes: number): boolean {
    const startTime = Number(start.split(':')[0]) * 60 + Number(start.split(':')[1]);
    const endTime = Number(end.split(':')[0]) * 60 + Number(end.split(':')[1]);
    const currentTime = currentHours * 60 + currentMinutes;

    if (currentTime > startTime && currentTime < endTime) {
      return true;
    } else {
      return false;
    }
  }
}
