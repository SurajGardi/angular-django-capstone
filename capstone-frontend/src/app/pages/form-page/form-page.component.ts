import { Component, OnInit } from '@angular/core';
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
