import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.css'],
})
export class ViewPatientsComponent implements OnInit {
  // apikey: string = '';
  patient_id: string = '';
  mobile: string = '';
  patient: Patient | null = null;
  patients: Patient[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getPatients().subscribe((data: Patient[]) => {
      this.patients = data;
    });
  }

  // onFetchPatient(): void {
  //   this.patientService
  //     .getPatientDetails(this.patient_id, this.mobile)
  //     .subscribe((data: Patient) => {
  //       this.patient = data;
  //     });
  // }
}
