const fs = require("fs");

function write(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log("OK: " + filePath);
}

write("src/app/services/record.service.ts", `import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecordData {
  name: string;
  email: string;
  age: number;
  phone: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class RecordService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-CLIENT-TYPE': 'Angular-Frontend'
  });

  constructor(private http: HttpClient) {}

  submitRecord(data: RecordData): Observable<ApiResponse> {
    const url = this.apiUrl + '/records/';
    return this.http.post<ApiResponse>(url, data, { headers: this.headers });
  }

  getRecords(page: number = 1, pageSize: number = 5): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    const url = this.apiUrl + '/records/';
    return this.http.get<ApiResponse>(url, { headers: this.headers, params });
  }

  getAllRecords(): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('page', '1')
      .set('page_size', '10000');
    const url = this.apiUrl + '/records/';
    return this.http.get<ApiResponse>(url, { headers: this.headers, params });
  }
}
`);

write("src/app/pages/list-page/list-page.component.ts", `import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  pagedRecords: any[] = [];
  allRecordsCache: any[] = [];
  filteredRecords: any[] = [];
  showLoader = false;
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;
  searchQuery: string = '';
  isSearching = false;

  constructor(
    private recordService: RecordService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPagedRecords();
    this.fetchAllForSearch();
  }

  fetchPagedRecords(): void {
    this.showLoader = true;
    this.recordService.getRecords(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.pagedRecords = res.data || [];
        this.filteredRecords = [...this.pagedRecords];
        if (res.pagination) {
          this.totalPages = res.pagination.total_pages;
          this.totalRecords = res.pagination.total;
        }
        if (this.totalRecords === 0) {
          this.toastService.show('info', 'No records found. Submit the form to add entries.');
        }
      },
      error: () => {
        this.showLoader = false;
        this.toastService.show('danger', 'Failed to load records. Please check if the backend is running.');
      }
    });
  }

  fetchAllForSearch(): void {
    this.recordService.getAllRecords().subscribe({
      next: (res: any) => {
        this.allRecordsCache = res.data || [];
      },
      error: () => {}
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.isSearching = false;
      this.filteredRecords = [...this.pagedRecords];
      return;
    }
    this.isSearching = true;
    const source = this.allRecordsCache.length > 0 ? this.allRecordsCache : this.pagedRecords;
    this.filteredRecords = source.filter((r, index) => {
      const idMatch = (index + 1).toString().includes(q);
      const nameMatch = r.name.toLowerCase().includes(q);
      return idMatch || nameMatch;
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearching = false;
    this.filteredRecords = [...this.pagedRecords];
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchPagedRecords();
  }

  goToForm(): void {
    this.router.navigate(['/form']);
  }
}
`);

write("src/app/pages/list-page/list-page.component.html", `<app-loader [show]="showLoader" message="Loading records..."></app-loader>

<div class="page-wrapper">
  <div class="container-fluid px-4">

    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-dark mb-0">All Records</h2>
        <p class="text-muted mb-0">All submitted entries from the form.</p>
      </div>
      <button class="btn btn-primary" (click)="goToForm()">&#43; Add New Record</button>
    </div>

    <div class="mb-3 col-lg-4 col-md-6 px-0">
      <div class="search-wrapper">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          class="form-control"
          placeholder="Search by # or Name across all records..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch()" />
      </div>
      <div class="d-flex align-items-center gap-2 mt-1" *ngIf="searchQuery">
        <small class="text-muted">
          {{ filteredRecords.length }} of {{ allRecordsCache.length || totalRecords }} result(s) for
          <strong>"{{ searchQuery }}"</strong>
        </small>
        <button class="btn btn-sm btn-link p-0 text-danger" (click)="clearSearch()">Clear</button>
      </div>
    </div>

    <div class="card p-3" *ngIf="!showLoader">

      <div *ngIf="filteredRecords.length === 0 && searchQuery" class="text-center py-4">
        <p class="text-muted fs-5">&#128269; No records match <strong>"{{ searchQuery }}"</strong></p>
        <button class="btn btn-outline-primary btn-sm" (click)="clearSearch()">Clear Search</button>
      </div>

      <div *ngIf="totalRecords === 0 && !searchQuery && !showLoader" class="text-center py-4">
        <p class="text-muted fs-5">&#128203; No records found.</p>
        <button class="btn btn-primary btn-sm" (click)="goToForm()">Submit First Record</button>
      </div>

      <app-record-table
        *ngIf="filteredRecords.length > 0"
        [records]="filteredRecords">
      </app-record-table>

      <app-pagination
        *ngIf="!isSearching && totalRecords > 0"
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        [totalRecords]="totalRecords"
        (pageChange)="onPageChange($event)">
      </app-pagination>

      <div *ngIf="isSearching && filteredRecords.length > 0" class="mt-2">
        <small class="text-muted fst-italic">
          Showing {{ filteredRecords.length }} matching record(s) across all
          {{ allRecordsCache.length || totalRecords }} entries.
          <a href="javascript:void(0)" class="text-primary ms-1" (click)="clearSearch()">Back to paginated view</a>
        </small>
      </div>

    </div>
  </div>
</div>
`);

console.log("\nAll done!");
