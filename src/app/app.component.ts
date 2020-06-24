import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ListenerService } from './services/listener.service';
import { NotificationsService } from './services/notifications.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private listenerService: ListenerService,
    private storageService: StorageService,
    private notificationService: NotificationsService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    if (this.platform.is('cordova')) {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificationService.init();

      const appEnabled = await this.storageService.getEnabledPref();

      if (appEnabled) {
        this.listenerService.startListening();
      }
    }
  }
}
