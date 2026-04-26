import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Appointment {
  appointmentDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'https://tfm-therapy-platform.onrender.com/api/appointments';

  constructor(private http: HttpClient) {}

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/me`);
  }
}