import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CarouselModule } from 'ngx-bootstrap';
import { DataServiceService } from './services/data-service.service'
import { filterPipe } from './filter';
import { MomentModule } from 'angular2-moment';
import { AccordionModule } from 'ngx-accordion';
import { OwlModule } from 'ngx-owl-carousel';
// import { BreadcrumbsModule } from "ng2-breadcrumbs";

import { MemberCreateComponent } from './components/member-create/member-create.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ConfirmInfoComponent } from './components/confirm-info/confirm-info.component';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMockDbService } from './mock-packageList';
import { TempFakeComponent } from './components/temp-fake/temp-fake.component';
import { ShareService } from "./services/share.service";
import { ThanksComponent } from './components/thanks/thanks.component';

export const routes : Routes = [
  {
    path:'',
    data: {
      breadcrumb: '首頁',
    },
    component: HomePageComponent
  },
  {
    path:'memberCreate',
    data: {
      breadcrumb: '會員',
    },
    component: MemberCreateComponent
  },
  {
    path:'fakeTemp',
    data: {
      breadcrumb: '假的按鈕頁',
    },
    component: TempFakeComponent
  },
  {
    path:'confirmPage',
    data: {
      breadcrumb: '確認投保資訊',
    },
    component: ConfirmInfoComponent
  },
  {
    path:'thanksPage',
    data: {
      breadcrumb: '投保感謝',
    },
    component: ThanksComponent
  }
]

@NgModule({
  declarations: [
    filterPipe,
    AppComponent,
    MemberCreateComponent,
    HomePageComponent,
    ConfirmInfoComponent,
    TempFakeComponent,
    ThanksComponent,
  ],
  imports: [
    CarouselModule,
    BrowserModule,
    // BreadcrumbsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    MomentModule,
    InMemoryWebApiModule.forRoot(InMockDbService),
    AccordionModule,
    HttpModule,
    OwlModule,
  ],
  providers: [
    DataServiceService,
    ShareService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
