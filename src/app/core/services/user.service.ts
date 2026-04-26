import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'THERAPIST' | 'ADMIN';
  enabled?: boolean;
  therapistRequested?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://tfm-therapy-platform.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  makeTherapist(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/make-therapist`, {});
  }

  rejectTherapist(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/reject-therapist`, {});
  }

  requestTherapist() {
    return this.http.post(`${this.apiUrl}/request-therapist`, {});
  }
}