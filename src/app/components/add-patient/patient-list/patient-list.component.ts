import { Component, OnInit, TemplateRef } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  editPatient: Patient | null = null; // Add this property
  closeResult = '';

  constructor(
    private patientService: PatientService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data.map((patient) => ({
          ...patient,
          selected: false,
        }));
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

  openModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
    // this.modalService
    //   .open(content, { ariaLabelledBy: 'modal-basic-title' })
    //   .result.then(
    //     (result) => {
    //       this.closeResult = `Closed with: ${result}`;
    //     },
    //     (reason) => {
    //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //     }
    //   );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  closeModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  onToggle(patient: Patient): void {
    patient.selected = !patient.selected;
  }
}
