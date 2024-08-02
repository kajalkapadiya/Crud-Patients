import { Component, Input } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent {
  @Input() closeModel!: () => void;

  patient: Patient = {
    name: '',
    age: 0,
    address: '',
    // apikey: '',
    zipcode: 0,
    mobile: 0,
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    blood_group: '',
  };

  constructor(private patientService: PatientService, private route: Router) {}

  onSubmit(): void {
    this.patientService.addPatient(this.patient).subscribe(
      (response) => {
        console.log('Patient added:', response);
        this.route.navigate(['/patient-list']);
        this.closeModel();
        location.reload();
      },
      (error) => {
        console.error('Error adding patient:', error);
      }
    );
  }
}
