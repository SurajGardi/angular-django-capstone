import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-record-table',
  templateUrl: './record-table.component.html',
  styleUrls: ['./record-table.component.scss']
})
export class RecordTableComponent {
  @Input() records: any[] = [];
  @Input() startIndex: number = 0;
}
