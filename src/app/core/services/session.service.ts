import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Session {
  id: number;
  videoLink: string;
  startTime: string;
  endTime: string;
  status: string;
  appointmentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private apiUrl = 'https://tfm-therapy-platform.onrender.com/api/sessions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl);
  }
}