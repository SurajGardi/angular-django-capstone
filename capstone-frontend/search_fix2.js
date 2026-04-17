const fs = require("fs");

function write(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log("OK: " + filePath);
}

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
  // All records from backend (for search)
  allRecordsCache: any[] = [];

  // Currently visible rows in table (slice of filtered)
  displayRecords: any[] = [];

  // After search filter applied
  filteredRecords: any[] = [];

  showLoader = false;
  isSearching = false;
  searchQuery: string = '';

  // Normal pagination (backend)
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;

  // Search pagination (frontend)
  searchPage = 1;
  searchPageSize = 5;
  searchTotalPages = 0;

  constructor(
    private recordService: RecordService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPage();
    this.fetchAllForSearch();
  }

  // ── Normal paginated fetch ──────────────────────────────────────────────
  fetchPage(): void {
    this.showLoader = true;
    this.recordService.getRecords(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.displayRecords = res.data || [];
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

  // ── Fetch all silently for search ───────────────────────────────────────
  fetchAllForSearch(): void {
    this.recordService.getAllRecords().subscribe({
      next: (res: any) => { this.allRecordsCache = res.data || []; },
      error: () => {}
    });
  }

  // ── Search ──────────────────────────────────────────────────────────────
  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.isSearching = false;
      this.filteredRecords = [];
      return;
    }
    this.isSearching = true;
    this.searchPage = 1;
    const source = this.allRecordsCache.length > 0 ? this.allRecordsCache : this.displayRecords;
    this.filteredRecords = source.filter(r =>
      r.name.toLowerCase().includes(q)
    );
    this.searchTotalPages = Math.ceil(this.filteredRecords.length / this.searchPageSize);
    this.sliceSearchPage();
  }

  sliceSearchPage(): void {
    const start = (this.searchPage - 1) * this.searchPageSize;
    this.displayRecords = this.filteredRecords.slice(start, start + this.searchPageSize);
  }

  onSearchPageChange(page: number): void {
    this.searchPage = page;
    this.sliceSearchPage();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearching = false;
    this.filteredRecords = [];
    this.searchPage = 1;
    this.fetchPage();
  }

  // ── Normal page change ──────────────────────────────────────────────────
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchPage();
  }

  // ── Global row index ────────────────────────────────────────────────────
  globalIndex(localIndex: number): number {
    if (this.isSearching) {
      return (this.searchPage - 1) * this.searchPageSize + localIndex + 1;
    }
    return (this.currentPage - 1) * this.pageSize + localIndex + 1;
  }

  goToForm(): void {
    this.router.navigate(['/form']);
  }
}
`);

write("src/app/pages/list-page/list-page.component.html", `<app-loader [show]="showLoader" message="Loading records..."></app-loader>

<div class="page-wrapper">
  <div class="container-fluid px-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-dark mb-0">All Records</h2>
        <p class="text-muted mb-0">All submitted entries from the form.</p>
      </div>
      <button class="btn btn-primary" (click)="goToForm()">&#43; Add New Record</button>
    </div>

    <!-- Search -->
    <div class="mb-3 col-lg-4 col-md-6 px-0">
      <div class="search-wrapper">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          class="form-control"
          placeholder="Search by Name across all records..."
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

    <!-- Table Card -->
    <div class="card p-3" *ngIf="!showLoader">

      <!-- No search match -->
      <div *ngIf="isSearching && filteredRecords.length === 0" class="text-center py-4">
        <p class="text-muted fs-5">&#128269; No records match <strong>"{{ searchQuery }}"</strong></p>
        <button class="btn btn-outline-primary btn-sm" (click)="clearSearch()">Clear Search</button>
      </div>

      <!-- No records at all -->
      <div *ngIf="!isSearching && totalRecords === 0" class="text-center py-4">
        <p class="text-muted fs-5">&#128203; No records found.</p>
        <button class="btn btn-primary btn-sm" (click)="goToForm()">Submit First Record</button>
      </div>

      <!-- Table with global index passed in -->
      <app-record-table
        *ngIf="displayRecords.length > 0"
        [records]="displayRecords"
        [startIndex]="isSearching
          ? (searchPage - 1) * searchPageSize
          : (currentPage - 1) * pageSize">
      </app-record-table>

      <!-- Normal pagination -->
      <app-pagination
        *ngIf="!isSearching && totalRecords > 0"
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        [totalRecords]="totalRecords"
        (pageChange)="onPageChange($event)">
      </app-pagination>

      <!-- Search pagination -->
      <app-pagination
        *ngIf="isSearching && filteredRecords.length > searchPageSize"
        [currentPage]="searchPage"
        [totalPages]="searchTotalPages"
        [totalRecords]="filteredRecords.length"
        (pageChange)="onSearchPageChange($event)">
      </app-pagination>

      <!-- Search footer note -->
      <div *ngIf="isSearching && filteredRecords.length > 0" class="mt-2">
        <small class="text-muted fst-italic">
          Searching across all {{ allRecordsCache.length || totalRecords }} records.
          <a href="javascript:void(0)" class="text-primary ms-1" (click)="clearSearch()">Back to default view</a>
        </small>
      </div>

    </div>

  </div>
</div>
`);

write("src/app/components/record-table/record-table.component.ts", `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-record-table',
  templateUrl: './record-table.component.html',
  styleUrls: ['./record-table.component.scss']
})
export class RecordTableComponent {
  @Input() records: any[] = [];
  @Input() startIndex: number = 0;
}
`);

write("src/app/components/record-table/record-table.component.html", `<div class="table-responsive">
  <table class="table table-hover align-middle mb-0">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Email</th>
        <th>Age</th>
        <th>Phone</th>
        <th>Submitted At</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let record of records; let i = index">
        <td><span class="badge-custom">{{ startIndex + i + 1 }}</span></td>
        <td class="fw-semibold">{{ record.name }}</td>
        <td>{{ record.email }}</td>
        <td>{{ record.age }}</td>
        <td>{{ record.phone }}</td>
        <td>{{ record.created_at | date:'dd MMM yyyy, hh:mm a' }}</td>
      </tr>
    </tbody>
  </table>
</div>
`);

console.log("\nAll done!");
