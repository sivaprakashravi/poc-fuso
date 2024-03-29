import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SimplebarAngularModule } from 'simplebar-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrderStatusComponent } from './features/order-status/order-status.component';
import { FaqComponent } from './features/faq/faq.component';
import { ConnectBoxComponent } from './shared/connect-box/connect-box.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { EtdComponent } from './features/etd/etd.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    OrderStatusComponent,
    FaqComponent,
    ConnectBoxComponent,
    PageNotFoundComponent,
    EtdComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SimplebarAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
