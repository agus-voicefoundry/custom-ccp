import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SoftphoneModule } from '../softphone/softphone.module';
import { MainUiComponent } from './main-ui/main-ui.component';
import { HeaderComponent } from './header/header.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { InnercontentComponent } from './innercontent/innercontent.component';
import { AgenthomeComponent } from './agenthome/agenthome.component';
import { UserdetailComponent } from './userdetail/userdetail.component';
import { UsersearchComponent } from './usersearch/usersearch.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SoftphoneModule
  ],
  declarations: [
    MainUiComponent,
    HeaderComponent,
    LeftbarComponent,
    InnercontentComponent,
    AgenthomeComponent,
    UserdetailComponent,
    UsersearchComponent
  ],
  exports: [
    MainUiComponent,
    HeaderComponent,
    LeftbarComponent,
    InnercontentComponent
  ]
})
export class MainUiModule { }
