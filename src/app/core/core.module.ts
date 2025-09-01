import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HeaderComponent } from '../common-component/header/header.component';
import { SidebarComponent } from '../common-component/sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { ModalComponent } from './modal/modal.component';
import { SuperAdminDashboardComponent } from '../components/super-admin-dashboard/super-admin-dashboard.component';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    SidebarComponent,
    ModalComponent,
    SuperAdminDashboardComponent    
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    
  ],
})
export class CoreModule { }
