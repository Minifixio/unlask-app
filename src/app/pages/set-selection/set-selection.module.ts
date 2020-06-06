import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetSelectionPageRoutingModule } from './set-selection-routing.module';

import { SetSelectionPage } from './set-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetSelectionPageRoutingModule
  ],
  declarations: [SetSelectionPage]
})
export class SetSelectionPageModule {}
