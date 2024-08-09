import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScreenSizeService } from '../services/screen-size.service';

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
  sortColumn: string = 'name';
  sortOrder: string = 'asc';
  isSmallScreen = false;

  @ViewChild('content', { static: true }) content: any;

  @ViewChild('editPatientModal', { static: true })
  editPatientModal!: TemplateRef<any>;

  constructor(
    private patientService: PatientService,
    private modalService: NgbModal,
    private router: Router,
    private _snackBar: MatSnackBar,
    private screenSizeService: ScreenSizeService
  ) {
    this.screenSizeService.isSmallScreen$.subscribe((isSmall) => {
      this.isSmallScreen = isSmall;
    });
  }

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
        this._snackBar.open('message', 'close', { duration: 3000 });
      }
    );
  }

  onEdit(patient: Patient): void {
    this.editPatient = { ...patient };
    this.open(this.editPatientModal);
  }

  onUpdate(): void {
    if (this.editPatient) {
      this.patientService.updatePatient(this.editPatient).subscribe(
        () => {
          this.fetchPatients();
          this.editPatient = null;
        },
        () => {
          this._snackBar.open('Error updating patients', 'close', {
            duration: 3000,
          });
        }
      );
    }
    this.closeModel();
  }

  onAddPatient(content: any) {
    if (this.isSmallScreen) {
      this.modalService.open(content);
    } else {
      this.router.navigate(['/add-patient']);
    }
  }

  onDelete(id?: string): void {
    if (id !== undefined) {
      this.patientService.deletePatient(id).subscribe(
        () => {
          this.fetchPatients();
        },
        (error) => {
          this._snackBar.open('Error deleting patient', 'close', {
            duration: 3000,
          });
        }
      );
    } else {
      this._snackBar.open('Patient ID is undefined', 'close', {
        duration: 3000,
      });
    }
  }

  openModel() {
    const modelDiv = document.getElementById('medicalFormModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  // open(content: TemplateRef<any>) {
  //   const modalRef = this.modalService.open(content, {
  //     ariaLabelledBy: 'modal-basic-title',
  //   });

  //   modalRef.result.then(
  //     (result) => {
  //       this.closeResult = `Complete the form click on Add patients.`;
  //     },
  //     (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(
  //         reason
  //       )} Click on Add patients to add in the table`;
  //     }
  //   );
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on the backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  // public navigateToOtherPage() {
  //   this.router.navigate(['/other-page']);
  // }

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
    this.router.navigate(['/app-products']);
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
    console.log('work');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
    this.modalService.dismissAll();
  }

  onToggle(patient: Patient): void {
    patient.selected = patient.selected;
  }

  onPageChange(event: number): void {
    this.currentPage = event;
  }
}
