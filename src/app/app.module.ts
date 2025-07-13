import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { LoaderComponent } from './core/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


@NgModule({ declarations: [
        AppComponent,
        LoaderComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        NgxExtendedPdfViewerModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule.forRoot(),
        MatIconModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
