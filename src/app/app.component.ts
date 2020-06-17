import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ListenerService } from './services/listener.service';
import { NotificationsService } from './services/notifications.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

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
    private notificationService: NotificationsService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    if (this.platform.is('cordova')) {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.listenerService.startListening();
      this.notificationService.init();
    }
  }
}
