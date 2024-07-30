import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  editPatient: Patient | null = null; // Add this property

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data;
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
  }

  onEdit(patient: Patient): void {
    this.editPatient = { ...patient };
  }

  onUpdate(): void {
    if (this.editPatient) {
      this.patientService.updatePatient(this.editPatient).subscribe(
        () => {
          this.fetchPatients();
          this.editPatient = null;
        },
        (error) => {
          console.error('Error updating patient:', error);
        }
      );
    }
  }

  onDelete(id?: number): void {
    if (id !== undefined) {
      this.patientService.deletePatient(id).subscribe(
        () => {
          this.fetchPatients();
        },
        (error) => {
          console.error('Error deleting patient:', error);
        }
      );
    } else {
      console.error('Patient ID is undefined');
    }
  }
}
