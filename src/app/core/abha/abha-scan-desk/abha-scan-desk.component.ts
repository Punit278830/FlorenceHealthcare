import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { IAbhaPatientDetails } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { AbhaService } from 'src/app/shared/Services/abha/abha.service';

@Component({
    selector: 'app-abha-scan-desk',
    templateUrl: './abha-scan-desk.component.html',
    styleUrls: ['./abha-scan-desk.component.scss'],
    standalone: false
})
export class AbhaScanDeskComponent {
  public routes = routes;
  public abhaPatients: Array<IAbhaPatientDetails> = [];

  constructor(private route: ActivatedRoute,
    private abhaService: AbhaService,
  ) { }

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(): void {

    this.abhaPatients = [];       
      this.abhaService.getAbhaPatients().subscribe((data: any) => {
        this.abhaPatients = data;
        });
  }

  public sortData(sort: Sort) {
    const data = this.abhaPatients.slice();

    if (!sort.active || sort.direction === '') {
      this.abhaPatients = data;
    } else {
      this.abhaPatients = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  
}
