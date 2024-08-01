import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';

import { FormsModule } from '@angular/forms';
import { PatientListComponent } from './components/add-patient/patient-list/patient-list.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    AddPatientComponent,
    PatientListComponent,
    FooterComponent,
    HeaderComponent,
    ProductsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, NgbModule,NgbDatepickerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
