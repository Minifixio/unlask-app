import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetEditionPageRoutingModule } from './set-edition-routing.module';

import { SetEditionPage } from './set-edition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetEditionPageRoutingModule
  ],
  declarations: [SetEditionPage]
})
export class SetEditionPageModule {}
