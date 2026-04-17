import { Component, OnInit } from '@angular/core';
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
