import { Component, OnInit, TemplateRef } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  editPatient: Patient | null = null;
  closeResult = '';
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private patientService: PatientService,
    private modalService: NgbModal,
    private route: Router
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
    const modelDiv = document.getElementById('medicalFormModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Complete the form click on Add patients.`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(
            reason
          )} Click on Add patients to add in the table`;
        }
      );
  }

  search() {
    this.route.navigate(['/app-products']);
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
    console.log(patient);
    patient.selected = patient.selected;
  }

  onPageChange(event: number): void {
    console.log('Page changed to:', event);

    this.currentPage = event;
    console.log('Current page:', this.currentPage);
  }
}
