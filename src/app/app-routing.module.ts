import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { OrderStatusComponent } from './features/order-status/order-status.component';
import { FaqComponent } from './features/faq/faq.component';
import { EtdComponent } from './features/etd/etd.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'order-status',
    component: OrderStatusComponent
  },
  {
    path: 'order-status/:orderNumber',
    component: OrderStatusComponent
  },
  {
    path: 'order-status/:orderNumber/:itemNumber',
    component: OrderStatusComponent
  },
  {
    path: 'etd-status',
    component: EtdComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
