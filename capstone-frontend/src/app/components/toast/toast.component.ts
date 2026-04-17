import { Component, OnInit, OnDestroy } from '@angular/core';
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
