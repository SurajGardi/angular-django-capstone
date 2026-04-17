import { Component, Input, Output, EventEmitter } from '@angular/core';

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
