const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("OK: " + filePath);
}

// ── record.service.ts ──────────────────────────────────────────────────────
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

// ── app.component.ts ───────────────────────────────────────────────────────
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

// ── app.component.html ─────────────────────────────────────────────────────
write("src/app/app.component.html", `<app-navbar></app-navbar>
<router-outlet></router-outlet>
`);

// ── app.module.ts ──────────────────────────────────────────────────────────
write("src/app/app.module.ts", `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';
import { RecordTableComponent } from './components/record-table/record-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormPageComponent,
    ListPageComponent,
    AlertMessageComponent,
    RecordTableComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
`);

// ── app-routing.module.ts ──────────────────────────────────────────────────
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

// ── navbar.component.ts ────────────────────────────────────────────────────
write("src/app/components/navbar/navbar.component.ts", `import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {}
`);

// ── navbar.component.html ──────────────────────────────────────────────────
write("src/app/components/navbar/navbar.component.html", `<nav class="navbar navbar-expand-lg">
  <div class="container">
    <a class="navbar-brand text-white fw-bold fs-5" routerLink="/form">&#9679; Capstone App</a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" routerLink="/form" routerLinkActive="active">&#43; Submit Record</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/list" routerLinkActive="active">&#9776; View Records</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
`);

// ── alert-message.component.ts ─────────────────────────────────────────────
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

// ── alert-message.component.html ───────────────────────────────────────────
write("src/app/components/alert-message/alert-message.component.html", `<div *ngIf="show" class="alert alert-{{type}} alert-dismissible fade show d-flex align-items-center" role="alert">
  <span *ngIf="type === 'success'">&#10003;&nbsp;</span>
  <span *ngIf="type === 'danger'">&#10007;&nbsp;</span>
  <span *ngIf="type === 'warning'">&#9888;&nbsp;</span>
  <span *ngIf="type === 'info'">&#9432;&nbsp;</span>
  <div>{{ message }}</div>
  <button type="button" class="btn-close ms-auto" (click)="close()"></button>
</div>
`);

// ── pagination.component.ts ────────────────────────────────────────────────
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

// ── pagination.component.html ──────────────────────────────────────────────
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

// ── record-table.component.ts ──────────────────────────────────────────────
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

// ── record-table.component.html ────────────────────────────────────────────
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

// ── form-page.component.ts ─────────────────────────────────────────────────
write("src/app/pages/form-page/form-page.component.ts", `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from '../../services/record.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  recordForm!: FormGroup;
  isSubmitting = false;
  alertShow = false;
  alertType: string = 'success';
  alertMessage = '';

  constructor(
    private fb: FormBuilder,
    private recordService: RecordService,
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

  showAlert(type: string, message: string): void {
    this.alertType = type;
    this.alertMessage = message;
    this.alertShow = true;
    setTimeout(() => { this.alertShow = false; }, 5000);
  }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.showAlert('danger', 'Please fix all errors before submitting.');
      return;
    }
    this.isSubmitting = true;
    this.alertShow = false;

    this.recordService.submitRecord(this.recordForm.value).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.showAlert('success', res.message || 'Record submitted successfully!');
        this.recordForm.reset();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const errData = err.error;
        if (errData && errData.errors) {
          const firstKey = Object.keys(errData.errors)[0];
          const msg = errData.errors[firstKey][0];
          this.showAlert('danger', msg || errData.message || 'Submission failed.');
        } else {
          this.showAlert('danger', 'Server error. Please try again later.');
        }
      }
    });
  }

  goToList(): void {
    this.router.navigate(['/list']);
  }
}
`);

// ── form-page.component.html ───────────────────────────────────────────────
write("src/app/pages/form-page/form-page.component.html", `<div class="page-wrapper">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-md-9">

        <div class="text-center mb-4">
          <h2 class="fw-bold text-dark">Submit a Record</h2>
          <p class="text-muted">Fill out the form below to add a new entry.</p>
        </div>

        <app-alert-message
          [show]="alertShow"
          [type]="alertType"
          [message]="alertMessage"
          (closed)="alertShow = false">
        </app-alert-message>

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
              <button type="button" class="btn btn-outline-primary" (click)="goToList()">View Records</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</div>
`);

// ── list-page.component.ts ─────────────────────────────────────────────────
write("src/app/pages/list-page/list-page.component.ts", `import { Component, OnInit } from '@angular/core';
import { RecordService } from '../../services/record.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  records: any[] = [];
  isLoading = true;
  alertShow = false;
  alertType: string = 'info';
  alertMessage = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;

  constructor(private recordService: RecordService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.isLoading = true;
    this.alertShow = false;
    this.recordService.getRecords(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.records = res.data || [];
        if (res.pagination) {
          this.totalPages = res.pagination.total_pages;
          this.totalRecords = res.pagination.total;
        }
        if (this.records.length === 0) {
          this.alertType = 'info';
          this.alertMessage = 'No records found. Submit the form to add entries.';
          this.alertShow = true;
        }
      },
      error: () => {
        this.isLoading = false;
        this.alertType = 'danger';
        this.alertMessage = 'Failed to load records. Please check if the backend is running.';
        this.alertShow = true;
      }
    });
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

// ── list-page.component.html ───────────────────────────────────────────────
write("src/app/pages/list-page/list-page.component.html", `<div class="page-wrapper">
  <div class="container">

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-dark mb-0">All Records</h2>
        <p class="text-muted mb-0">All submitted entries from the form.</p>
      </div>
      <button class="btn btn-primary" (click)="goToForm()">&#43; Add New Record</button>
    </div>

    <app-alert-message
      [show]="alertShow"
      [type]="alertType"
      [message]="alertMessage"
      (closed)="alertShow = false">
    </app-alert-message>

    <div class="spinner-wrapper" *ngIf="isLoading">
      <div class="text-center">
        <div class="spinner-border text-primary" style="width:3rem;height:3rem"></div>
        <p class="mt-3 text-muted">Loading records...</p>
      </div>
    </div>

    <div class="card p-3" *ngIf="!isLoading && records.length > 0">
      <app-record-table [records]="records"></app-record-table>
      <app-pagination
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        [totalRecords]="totalRecords"
        (pageChange)="onPageChange($event)">
      </app-pagination>
    </div>

  </div>
</div>
`);

// ── tsconfig.json ──────────────────────────────────────────────────────────
write("tsconfig.json", JSON.stringify({
  compileOnSave: false,
  compilerOptions: {
    baseUrl: "./",
    outDir: "./dist/out-tsc",
    forceConsistentCasingInFileNames: true,
    strict: true,
    noImplicitOverride: true,
    noPropertyAccessFromIndexSignature: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    sourceMap: true,
    declaration: false,
    downlevelIteration: true,
    experimentalDecorators: true,
    moduleResolution: "node",
    importHelpers: true,
    target: "ES2017",
    module: "ES2020",
    lib: ["ES2020", "dom"],
    skipLibCheck: true
  },
  angularCompilerOptions: {
    enableI18nLegacyMessageIdFormat: false,
    strictInjectionParameters: true,
    strictInputAccessModifiers: true,
    strictTemplates: true
  }
}, null, 2));

console.log("\nAll files written successfully!");
