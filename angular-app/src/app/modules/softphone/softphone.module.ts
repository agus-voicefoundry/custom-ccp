import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SoftphoneComponent } from './softphone/softphone.component';
import { AgentstatusComponent } from './agentstatus/agentstatus.component';
import { DialpadComponent } from './dialpad/dialpad.component';
import { CallingComponent } from './calling/calling.component';
import { IncomingcallComponent } from './incomingcall/incomingcall.component';
import { OncallComponent } from './oncall/oncall.component';
import { TransferComponent } from './transfer/transfer.component';
import { AftercallComponent } from './aftercall/aftercall.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SoftphoneComponent,
    AgentstatusComponent,
    DialpadComponent,
    CallingComponent,
    IncomingcallComponent,
    OncallComponent,
    TransferComponent,
    AftercallComponent
  ],
  exports:[
    SoftphoneComponent,
    AgentstatusComponent,
    DialpadComponent,
    CallingComponent,
    IncomingcallComponent,
    OncallComponent,
    TransferComponent,
    AftercallComponent
  ]
})
export class SoftphoneModule { }
