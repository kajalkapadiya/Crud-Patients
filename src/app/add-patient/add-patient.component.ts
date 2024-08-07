import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent {
  @Input() closeModel!: () => void;

  patient: Patient = {
    id: uuidv4(),
    name: '',
    age: 0,
    address: '',
    zipcode: 0,
    mobile: 0,
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    blood_group: '',
    email: '',
    password: '',
  };

  constructor(
    private patientService: PatientService,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    this.patientService.addPatient(this.patient).subscribe(
      (response) => {
        this.route.navigate(['/patient-list']);
        this.closeModel();
        location.reload();
      },
      (error) => {
        this._snackBar.open('Error adding patient:', 'close', {
          duration: 3000,
        });
      }
    );
  }
}
