import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestModuleRoutingModule } from './testModule-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { TestScheduleComponent } from './test-schedule.component';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';


@NgModule({
  declarations: [
   TestScheduleComponent
  ],
  imports: [
    CommonModule,
    TestModuleRoutingModule,
    SharedModule,
    ScheduleModule,
    
   
  ]
})
export class TestModuleModule {

 }
