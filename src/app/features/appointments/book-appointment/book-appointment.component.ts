import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AvailabilityService, AvailabilitySlot } from '../../../core/services/availability.service';

interface Therapist {
  id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {

  therapists: Therapist[] = [];
  availability: AvailabilitySlot[] = [];
  availableHours: number[] = [];

  selectedTherapistId: number | null = null;
  selectedDate: string = '';
  selectedHour: number | null = null;

  minDate: string = '';
  error: string = '';

  private apiUrl = 'https://tfm-therapy-platform.onrender.com/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private availabilityService: AvailabilityService
  ) {}

  ngOnInit() {
    this.loadTherapists();

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  loadTherapists() {
    this.http.get<Therapist[]>(`${this.apiUrl}/users/therapists`)
      .subscribe({
        next: (data) => this.therapists = data,
        error: () => this.error = 'Error cargando terapeutas'
      });
  }

  onTherapistChange() {
    this.selectedHour = null;
    this.selectedDate = '';

    if (!this.selectedTherapistId) return;

    this.availabilityService.getByTherapistId(this.selectedTherapistId)
      .subscribe({
        next: (data) => {
          this.availability = data;
          this.updateAvailableHours();
        }
      });
  }

  onDateChange() {
    this.selectedHour = null;
    this.updateAvailableHours();
  }

  updateAvailableHours() {
    if (!this.selectedDate || this.availability.length === 0) {
      this.availableHours = [];
      return;
    }

    const day = this.getDayOfWeek(this.selectedDate);

    this.availableHours = this.availability
      .filter(a => a.dayOfWeek === day)
      .map(a => a.hour)
      .sort((a, b) => a - b);
  }

  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);

    const days = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];

    return days[date.getDay()];
  }

  createAppointment() {
    if (!this.selectedTherapistId || !this.selectedDate || this.selectedHour === null) {
      this.error = 'Completa todos los campos';
      return;
    }

    const appointmentDate = new Date(this.selectedDate);
    appointmentDate.setHours(this.selectedHour, 0, 0, 0);

    const payload = {
      therapistId: this.selectedTherapistId,
      appointmentDate: appointmentDate.toISOString()
    };

    this.http.post<any>(`${this.apiUrl}/appointments`, payload).subscribe({
      next: (appointment) => {

        const appointmentId = appointment.id;

        this.http.post(`${this.apiUrl}/payments/intent/${appointmentId}`, {})
          .subscribe({
            next: () => {

              this.http.post(`${this.apiUrl}/payments/confirm/${appointmentId}`, {})
                .subscribe({
                  next: () => {
                    this.router.navigate(['/dashboard']);
                  },
                  error: () => {
                    this.error = 'Error confirmando pago';
                  }
                });

            },
            error: () => {
              this.error = 'Error creando intento de pago';
            }
          });

      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear cita';
      }
    });
  }
}