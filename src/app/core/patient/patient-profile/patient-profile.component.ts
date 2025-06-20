import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/data/data.service';
import { patientProfile } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { FileUploadService } from 'src/app/shared/Services/fileUpload/file-upload.service';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent {
public routes = routes;
public patientProfile: Array<patientProfile> = [];

constructor(public data : DataService, private fileUploadService: FileUploadService)
{
  this.patientProfile = this.data.patientProfile;
}

public sortData(sort: Sort) {
  const data = this.patientProfile.slice();

  if (!sort.active || sort.direction === '') {
    this.patientProfile = data;
  } else {
    this.patientProfile = data.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aValue = (a as any)[sort.active];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bValue = (b as any)[sort.active];
      return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
  }
}

public selectedPreview: string | null = null;
public selectedVitalsDocuments: Array<{name: string, url: string}> = [];

openDocumentsModal(data: any) {
  this.fileUploadService.getUpodedFileByAppointment(data.id).subscribe(files => {
    // Find preview file (e.g., docName === 'previewFile')
    const preview = files.find(f => f.docName === 'previewFile');
    this.selectedPreview = preview && preview.fileData ? preview.fileData : null;
    // Find all vitals documents (e.g., docName === 'vital')
    this.selectedVitalsDocuments = files
      .filter(f => f.docName === 'vital')
      .map(f => ({ name: f.fileName || '', url: f.fileData || '' }));
    setTimeout(() => {
      const modal: any = document.getElementById('documentsModal');
      if (modal) {
        (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
      }
    }, 0);
  });
}

public selectedAppointment: any = null;

openAppointmentVitals(data: any) {
  this.selectedAppointment = data;
  const appointmentId = data.id || data.appointmentNumber;
  this.fileUploadService.getUpodedFileByAppointment(appointmentId).subscribe(files => {
    // Find all vitals documents (e.g., docName === 'vital')
    this.selectedVitalsDocuments = files
      .filter(f => f.docName === 'vital')
      .map(f => ({ name: f.fileName || '', url: f.fileData || '' }));
  });
}

printPreview() {
  if (this.selectedPreview) {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write('<html><head><title>Preview Print</title></head><body>');
    printWindow?.document.write('<img src="' + this.selectedPreview + '" style="max-width:100%; max-height:100%;"/>');
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.print();
  }
}
}
