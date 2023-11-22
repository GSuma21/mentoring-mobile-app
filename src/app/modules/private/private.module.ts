import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PrivateComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    TranslateModule

  ],
  exports:[
    PrivateComponent
  ]
})
export class PrivateModule { }
