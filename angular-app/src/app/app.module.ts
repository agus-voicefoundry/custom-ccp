import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import { SharedservicesModule } from './modules/sharedservices/sharedservices.module';
import { SoftphoneModule } from './modules/softphone/softphone.module';
import { MainUiModule } from './modules/main-ui/main-ui.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedservicesModule.forRoot(),
    HttpModule,
    SoftphoneModule,
    MainUiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
