import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { StorageService } from 'src/app/services/storage.service';
import { ListenerService } from 'src/app/services/listener.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {

  notificationActive = true;
  questionsAmount = '01';
  appEnabled = true;
  timeRangeEnabled = false;
  timeRange = {start: '08:00', end: '19:00'};

  constructor(
    private notificationService: NotificationsService,
    private storageService: StorageService,
    private listenerService: ListenerService
  ) { }

  ngOnInit() {
    this.storageService.getNotificationPref().then(res => this.notificationActive = res);
    this.storageService.getEnabledPref().then(res => this.appEnabled = res);
    this.storageService.getQuestionAmountPref().then(res => this.questionsAmount = String(res).padStart(2, '0'));
    this.storageService.getTimeRangeEnabledPref().then(res => this.timeRangeEnabled = res);
    this.storageService.getTimeRangePref().then(res => this.timeRange = res);
  }

  async notificationPref(event: CustomEvent) {
    this.notificationActive = event.detail.checked;
    if (event.detail.checked) {
      await this.notificationService.enableNotification();
    } else {
      await this.notificationService.disableNotification();
    }
  }

  async questionAmountPref(event: CustomEvent) {
    this.questionsAmount = event.detail.value;
    await this.storageService.setQuestionAmountPref(Number(event.detail.value));
  }

  async enabledPref(event: CustomEvent) {
    this.appEnabled = event.detail.checked;
    if (event.detail.checked) {
      await this.storageService.setEnabledPref(true);
      this.listenerService.startListening();
    } else {
      await this.storageService.setEnabledPref(false);
      this.listenerService.stopListening();
    }
  }

  async timeRangeEnabledPref(event: CustomEvent) {
    this.timeRangeEnabled = event.detail.checked;
    if (event.detail.checked) {
      await this.storageService.setTimeRangeEnabledPref(true);
    } else {
      await this.storageService.setTimeRangeEnabledPref(false);
    }
  }

  hourToDate(time: string) {
    const hours = time.split(':')[0].padStart(2, '0');
    const minutes = time.split(':')[1].padStart(2, '0');
    const date = new Date(`1995-12-17T${hours}:${minutes}:00`);
    return date.toISOString();
  }

  changeRangeStartTime(event: CustomEvent) {
    const selectedDate = new Date(event.detail.value);
    console.log(`${selectedDate.getHours()}:${selectedDate.getHours()}`);
    this.storageService.setTimeRangeStart(`${selectedDate.getHours()}:${selectedDate.getHours()}`);
  }

  changeRangeEndTime(event: CustomEvent) {
    const selectedDate = new Date(event.detail.value);
    console.log(`${selectedDate.getHours()}:${selectedDate.getHours()}`);
    this.storageService.setTimeRangeEnd(`${selectedDate.getHours()}:${selectedDate.getHours()}`);
  }
}
