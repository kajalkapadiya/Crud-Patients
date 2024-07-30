import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { ViewPatientsComponent } from './components/view-patients/view-patients.component';
import { PatientListComponent } from './patient-list/patient-list.component';

const routes: Routes = [
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'view-patients', component: ViewPatientsComponent },
  { path: 'patient-list', component: PatientListComponent },

  { path: '', redirectTo: '/view-patients', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
