// import { Component } from '@angular/core';
// import { PatientService } from 'src/app/services/patient.service';
// import { Patient } from 'src/app/models/patient.model';

// @Component({
//   selector: 'app-add-patient',
//   templateUrl: './add-patient.component.html',
//   styleUrls: ['./add-patient.component.css'],
// })
// export class AddPatientComponent {
//   patient: Patient = {
//     name: '',
//     age: 0,
//     address: '',
//   };

//   constructor(private patientService: PatientService) {}

//   onSubmit(): void {
//     this.patientService.addPatient(this.patient).subscribe((response) => {
//       console.log('Patient added:', response);
//     });
//   }
// }

import { Component } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent {
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

  constructor(private patientService: PatientService) {}

  onSubmit(): void {
    this.patientService.addPatient(this.patient).subscribe(
      (response) => {
        console.log('Patient added:', response);
      },
      (error) => {
        console.error('Error adding patient:', error);
      }
    );
  }
}
