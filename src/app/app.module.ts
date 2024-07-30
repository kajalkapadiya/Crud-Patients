import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http'; // Add HttpClientModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { ViewPatientsComponent } from './components/view-patients/view-patients.component';

import { FormsModule } from '@angular/forms';
import { PatientListComponent } from './patient-list/patient-list.component'; // Import FormsModule

@NgModule({
  declarations: [AppComponent, AddPatientComponent, ViewPatientsComponent, PatientListComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
