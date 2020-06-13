import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(
    public toastController: ToastController
  ) { }

  async error(error: string) {
    const toast = await this.toastController.create({
      message: error,
      color: 'warning',
      duration: 4000
    });
    toast.present();
  }

  async info(info: string) {
    const toast = await this.toastController.create({
      message: info,
      duration: 4000
    });
    toast.present();
  }
}
