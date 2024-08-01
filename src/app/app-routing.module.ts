import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { PatientListComponent } from './components/add-patient/patient-list/patient-list.component';

const routes: Routes = [
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'patient-list', component: PatientListComponent },

  { path: '', redirectTo: '/view-patients', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
