import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmazonconnectService, IncomingContact } from '../../services/amazonconnect.service';
import { UserService } from '../../services/user.service';
import { AgentService } from '../../services/agent.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AmazonconnectService, UserService, AgentService]
})
export class SharedservicesModule {
  constructor (@Optional() @SkipSelf() parentModule: SharedservicesModule) {
    if (parentModule) {
      throw new Error(
        'SharedservicesModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedservicesModule,
      providers: []
    };
  }
}
