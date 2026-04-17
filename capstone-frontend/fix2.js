const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("OK: " + filePath);
}

write("src/styles.scss", `@import 'bootstrap/dist/css/bootstrap.min.css';

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f0f4f8;
}

.page-wrapper {
  height: calc(100vh - 60px);
  overflow: hidden;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.btn { border-radius: 8px; font-weight: 500; }
.alert { border-radius: 8px; }

.table thead th {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.table tbody tr:hover { background-color: #f0f4ff; }

.badge-custom {
  background-color: #4f46e5;
  color: white;
  padding: 4px 10px;
  border-radius: 50%;
  font-size: 12px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

nav.navbar {
  height: 60px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.nav-link {
  color: rgba(255,255,255,0.85) !important;
  font-weight: 500;
  margin: 0 5px;
  border-radius: 6px;
  padding: 6px 14px !important;
  transition: background 0.2s;
}

.nav-link:hover, .nav-link.active {
  background: rgba(255,255,255,0.2);
  color: white !important;
}

.form-control:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 0.2rem rgba(79,70,229,0.15);
}

.invalid-feedback { font-size: 12px; }

.full-loader {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.82);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.full-loader p {
  color: #4f46e5;
  font-weight: 600;
  font-size: 16px;
}

.toast-container {
  position: fixed;
  top: 72px;
  right: 20px;
  z-index: 10000;
  min-width: 320px;
}

.toast-box {
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

.toast-success { background: #d1fae5; border-left: 4px solid #10b981; color: #065f46; }
.toast-danger  { background: #fee2e2; border-left: 4px solid #ef4444; color: #7f1d1d; }
.toast-info    { background: #dbeafe; border-left: 4px solid #3b82f6; color: #1e3a8a; }

.toast-icon { font-size: 20px; }
.toast-close { margin-left: auto; cursor: pointer; font-size: 18px; opacity: 0.6; }
.toast-close:hover { opacity: 1; }

.search-wrapper { position: relative; }
.search-wrapper .search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
  pointer-events: none;
}
.search-wrapper input { padding-left: 32px; }

.page-item.active .page-link {
  background-color: #4f46e5;
  border-color: #4f46e5;
}
.page-link { color: #4f46e5; }
.page-link:hover { color: #3730a3; }
`);

write("src/app/services/toast.service.ts", `import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  type: 'success' | 'danger' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(type: Toast['type'], message: string): void {
    this.toastSubject.next({ type, message });
  }
}
`);

write("src/app/components/toast/toast.component.ts", `import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (Toast & { id: number })[] = [];
  private sub!: Subscription;
  private counter = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe((t: Toast) => {
      const id = ++this.counter;
      this.toasts.push({ ...t, id });
      setTimeout(() => this.remove(id), 4000);
    });
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  icon(type: string): string {
    return type === 'success' ? '✔' : type === 'danger' ? '✖' : 'ℹ';
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
`);

write("src/app/components/toast/toast.component.html", `<div class="toast-container">
  <div *ngFor="let t of toasts" class="toast-box toast-{{t.type}} mb-2">
    <span class="toast-icon">{{ icon(t.type) }}</span>
    <span>{{ t.message }}</span>
    <span class="toast-close" (click)="remove(t.id)">&times;</span>
  </div>
</div>
`);

write("src/app/components/toast/toast.component.scss", ``);

write("src/app/components/loader/loader.component.ts", `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() message: string = 'Loading...';
  @Input() show: boolean = false;
}
`);

write("src/app/components/loader/loader.component.html", `<div class="full-loader" *ngIf="show">
  <div class="spinner-border text-primary" style="width:3.5rem;height:3.5rem;border-width:4px"></div>
  <p>{{ message }}</p>
</div>
`);

write("src/app/components/loader/loader.component.scss", ``);

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
}
`);

write("src/app/app.module.ts", `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';
import { RecordTableComponent } from './components/record-table/record-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ToastComponent } from './components/toast/toast.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormPageComponent,
    ListPageComponent,
    AlertMessageComponent,
    RecordTableComponent,
    PaginationComponent,
    ToastComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
`);

write("src/app/app.component.ts", `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'capstone-frontend';
}
`);

write("src/app/app.component.html", `<app-navbar></app-navbar>
<app-toast></app-toast>
<router-outlet></router-outlet>
`);

write("src/app/app-routing.module.ts", `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'form', pathMatch: 'full' },
  { path: 'form', component: FormPageComponent },
  { path: 'list', component: ListPageComponent },
  { path: '**', redirectTo: 'form' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
`);

write("src/app/components/navbar/navbar.component.ts", `import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {}
`);

write("src/app/components/navbar/navbar.component.html", `<nav class="navbar navbar-expand-lg">
  <div class="container-fluid px-4">
    <a class="navbar-brand text-white fw-bold fs-5" routerLink="/form">&#9679; Capstone App</a>
    <div class="ms-auto d-flex gap-2">
      <a class="nav-link" routerLink="/form" routerLinkActive="active">&#43; Submit Record</a>
      <a class="nav-link" routerLink="/list" routerLinkActive="active">&#9776; View Records</a>
    </div>
  </div>
</nav>
`);

write("src/app/components/navbar/navbar.component.scss", ``);

write("src/app/components/alert-message/alert-message.component.ts", `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent {
  @Input() type: string = 'info';
  @Input() message: string = '';
  @Input() show: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.show = false;
    this.closed.emit();
  }
}
`);

write("src/app/components/alert-message/alert-message.component.html", `<div *ngIf="show" class="alert alert-{{type}} alert-dismissible fade show d-flex align-items-center" role="alert">
  <span *ngIf="type === 'success'">&#10003;&nbsp;</span>
  <span *ngIf="type === 'danger'">&#10007;&nbsp;</span>
  <span *ngIf="type === 'warning'">&#9888;&nbsp;</span>
  <span *ngIf="type === 'info'">&#9432;&nbsp;</span>
  <div>{{ message }}</div>
  <button type="button" class="btn-close ms-auto" (click)="close()"></button>
</div>
`);

write("src/app/components/alert-message/alert-message.component.scss", ``);

write("src/app/components/pagination/pagination.component.ts", `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalRecords: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
`);

write("src/app/components/pagination/pagination.component.html", `<div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2" *ngIf="totalPages > 0">
  <small class="text-muted">
    Showing page {{ currentPage }} of {{ totalPages }} ({{ totalRecords }} total records)
  </small>
  <nav>
    <ul class="pagination pagination-sm mb-0">
      <li class="page-item" [class.disabled]="currentPage === 1">
        <a class="page-link" (click)="goTo(currentPage - 1)" style="cursor:pointer">Previous</a>
      </li>
      <li class="page-item" *ngFor="let p of pages" [class.active]="p === currentPage">
        <a class="page-link" (click)="goTo(p)" style="cursor:pointer">{{ p }}</a>
      </li>
      <li class="page-item" [class.disabled]="currentPage === totalPages">
        <a class="page-link" (click)="goTo(currentPage + 1)" style="cursor:pointer">Next</a>
      </li>
    </ul>
  </nav>
</div>
`);

write("src/app/components/pagination/pagination.component.scss", ``);

write("src/app/components/record-table/record-table.component.ts", `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-record-table',
  templateUrl: './record-table.component.html',
  styleUrls: ['./record-table.component.scss']
})
export class RecordTableComponent {
  @Input() records: any[] = [];
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
        <td><span class="badge-custom">{{ i + 1 }}</span></td>
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

write("src/app/components/record-table/record-table.component.scss", ``);

write("src/app/pages/form-page/form-page.component.ts", `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  recordForm!: FormGroup;
  isSubmitting = false;
  showLoader = false;

  constructor(
    private fb: FormBuilder,
    private recordService: RecordService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recordForm = this.fb.group({
      name:  ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      age:   ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,13}$')]]
    });
  }

  get f() { return this.recordForm.controls; }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.toastService.show('danger', 'Please fix all errors before submitting.');
      return;
    }
    this.showLoader = true;
    this.isSubmitting = true;

    this.recordService.submitRecord(this.recordForm.value).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.isSubmitting = false;
        this.recordForm.reset();
        this.toastService.show('success', res.message || 'Record submitted successfully!');
        setTimeout(() => { this.router.navigate(['/list']); }, 1200);
      },
      error: (err: any) => {
        this.showLoader = false;
        this.isSubmitting = false;
        const errData = err.error;
        if (errData && errData.errors) {
          const firstKey = Object.keys(errData.errors)[0];
          const msg = errData.errors[firstKey][0];
          this.toastService.show('danger', msg || errData.message || 'Submission failed.');
        } else {
          this.toastService.show('danger', 'Server error. Please try again later.');
        }
      }
    });
  }
}
`);

write("src/app/pages/form-page/form-page.component.html", `<app-loader [show]="showLoader" message="Submitting record..."></app-loader>

<div class="page-wrapper">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-md-9">

        <div class="text-center mb-4">
          <h2 class="fw-bold text-dark">Submit a Record</h2>
          <p class="text-muted">Fill out the form below to add a new entry.</p>
        </div>

        <div class="card p-4">
          <form [formGroup]="recordForm" (ngSubmit)="onSubmit()" novalidate>

            <div class="mb-3">
              <label class="form-label fw-semibold">Full Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" formControlName="name" placeholder="e.g. Suraj Sharma"
                [class.is-invalid]="f['name'].touched && f['name'].invalid"
                [class.is-valid]="f['name'].touched && f['name'].valid">
              <div class="invalid-feedback">
                <span *ngIf="f['name'].errors?.['required']">Name is required.</span>
                <span *ngIf="f['name'].errors?.['minlength']">Name must be at least 2 characters.</span>
                <span *ngIf="f['name'].errors?.['pattern']">Name must contain only letters and spaces.</span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Email Address <span class="text-danger">*</span></label>
              <input type="email" class="form-control" formControlName="email" placeholder="e.g. suraj@example.com"
                [class.is-invalid]="f['email'].touched && f['email'].invalid"
                [class.is-valid]="f['email'].touched && f['email'].valid">
              <div class="invalid-feedback">
                <span *ngIf="f['email'].errors?.['required']">Email is required.</span>
                <span *ngIf="f['email'].errors?.['email']">Enter a valid email address.</span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Age <span class="text-danger">*</span></label>
              <input type="number" class="form-control" formControlName="age" placeholder="Must be between 18 and 100"
                [class.is-invalid]="f['age'].touched && f['age'].invalid"
                [class.is-valid]="f['age'].touched && f['age'].valid">
              <div class="invalid-feedback">
                <span *ngIf="f['age'].errors?.['required']">Age is required.</span>
                <span *ngIf="f['age'].errors?.['min']">Age must be at least 18.</span>
                <span *ngIf="f['age'].errors?.['max']">Age must be at most 100.</span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold">Phone Number <span class="text-danger">*</span></label>
              <input type="text" class="form-control" formControlName="phone" placeholder="e.g. 9876543210"
                [class.is-invalid]="f['phone'].touched && f['phone'].invalid"
                [class.is-valid]="f['phone'].touched && f['phone'].valid">
              <div class="invalid-feedback">
                <span *ngIf="f['phone'].errors?.['required']">Phone is required.</span>
                <span *ngIf="f['phone'].errors?.['pattern']">Phone must be 10 to 13 digits only.</span>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary flex-fill" [disabled]="isSubmitting">
                <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSubmitting ? 'Submitting...' : 'Submit Record' }}
              </button>
              <button type="button" class="btn btn-outline-secondary" (click)="recordForm.reset()">Reset</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</div>
`);

write("src/app/pages/form-page/form-page.component.scss", ``);

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
  allRecords: any[] = [];
  filteredRecords: any[] = [];
  showLoader = false;
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;
  searchQuery: string = '';

  constructor(
    private recordService: RecordService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.showLoader = true;
    this.recordService.getRecords(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.allRecords = res.data || [];
        this.filteredRecords = [...this.allRecords];
        if (res.pagination) {
          this.totalPages = res.pagination.total_pages;
          this.totalRecords = res.pagination.total;
        }
        if (this.allRecords.length === 0) {
          this.toastService.show('info', 'No records found. Submit the form to add entries.');
        }
        if (this.searchQuery.trim()) {
          this.applyFilter();
        }
      },
      error: () => {
        this.showLoader = false;
        this.toastService.show('danger', 'Failed to load records. Please check if the backend is running.');
      }
    });
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredRecords = [...this.allRecords];
      return;
    }
    this.filteredRecords = this.allRecords.filter((r, index) => {
      const idMatch = (index + 1).toString().includes(q);
      const nameMatch = r.name.toLowerCase().includes(q);
      return idMatch || nameMatch;
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredRecords = [...this.allRecords];
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchRecords();
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
          placeholder="Search by # or Name..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch()" />
      </div>
      <div class="d-flex align-items-center gap-2 mt-1" *ngIf="searchQuery">
        <small class="text-muted">
          {{ filteredRecords.length }} result(s) for <strong>"{{ searchQuery }}"</strong>
        </small>
        <button class="btn btn-sm btn-link p-0 text-danger" (click)="clearSearch()">Clear</button>
      </div>
    </div>

    <div class="card p-3" *ngIf="!showLoader">

      <div *ngIf="filteredRecords.length === 0 && searchQuery" class="text-center py-4">
        <p class="text-muted fs-5">&#128269; No records match <strong>"{{ searchQuery }}"</strong></p>
        <button class="btn btn-outline-primary btn-sm" (click)="clearSearch()">Clear Search</button>
      </div>

      <div *ngIf="allRecords.length === 0 && !searchQuery" class="text-center py-4">
        <p class="text-muted fs-5">&#128203; No records found.</p>
        <button class="btn btn-primary btn-sm" (click)="goToForm()">Submit First Record</button>
      </div>

      <app-record-table
        *ngIf="filteredRecords.length > 0"
        [records]="filteredRecords">
      </app-record-table>

      <app-pagination
        *ngIf="!searchQuery && allRecords.length > 0"
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        [totalRecords]="totalRecords"
        (pageChange)="onPageChange($event)">
      </app-pagination>

    </div>

  </div>
</div>
`);

write("src/app/pages/list-page/list-page.component.scss", ``);

console.log("\nAll files written!");
