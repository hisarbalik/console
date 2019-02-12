import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FundamentalNgxModule } from 'fundamental-ngx';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchService } from './search-form/service/search-service';
import { LuigiContextService } from './search-form/service/luigi-context.service';

@NgModule({
  declarations: [AppComponent, SearchFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FundamentalNgxModule,
    HttpClientModule,
  ],
  providers: [SearchService, LuigiContextService],
  bootstrap: [AppComponent],
})
export class AppModule {}