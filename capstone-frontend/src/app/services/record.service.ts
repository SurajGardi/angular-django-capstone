import { Injectable } from '@angular/core';
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
