import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvailabilitySlot {
  dayOfWeek: string;
  hour: number;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  private apiUrl = 'https://tfm-therapy-platform.onrender.com/api/availability';

  constructor(private http: HttpClient) {}

  getMyAvailability(): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(this.apiUrl);
  }

  saveAvailability(slots: AvailabilitySlot[]) {
    return this.http.put(this.apiUrl, { slots });
  }

  getByTherapistId(id: number): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(`${this.apiUrl}/${id}`);
  }
}