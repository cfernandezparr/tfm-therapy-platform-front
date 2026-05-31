import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../core/services/user.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { SessionService, Session } from '../../core/services/session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user!: User;
  appointments: any[] = [];
  adminAppointments: any[] = [];
  sessions: Session[] = [];
  users: User[] = [];

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.loadUser();
    this.loadAppointments();
    this.loadSessions();
  }

  loadUser() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;

        if (this.isAdmin()) {
          this.loadUsers();
          this.loadAdminAppointments();
        }
      }
    });
  }

  loadAppointments() {
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => this.appointments = data
    });
  }

  loadAdminAppointments() {
    this.appointmentService.getAll().subscribe({
      next: (data) => this.adminAppointments = data
    });
  }

  loadSessions() {
    this.sessionService.getAll().subscribe({
      next: (data) => this.sessions = data
    });
  }

  getSessionLink(appointmentId: number): string | null {

    const session = this.sessions.find(
      s => s.appointmentId === appointmentId
    );

    return session ? session.videoLink : null;
  }

  getSessionId(appointmentId: number): number | null {

    const session = this.sessions.find(
      s => s.appointmentId === appointmentId
    );

    return session ? session.id : null;
  }

  canJoinSession(appt: any): boolean {

    return (
      appt.status === 'CONFIRMED' &&
      this.getSessionLink(appt.id) !== null
    );
  }

  getSortedAppointments() {

    const order: any = {
      CONFIRMED: 1,
      COMPLETED: 2,
      CANCELLED: 3
    };

    return [...this.appointments]
      .sort((a, b) => order[a.status] - order[b.status]);
  }

  getSortedAdminAppointments() {

    const order: any = {
      CONFIRMED: 1,
      COMPLETED: 2,
      CANCELLED: 3
    };

    return [...this.adminAppointments]
      .sort((a, b) => order[a.status] - order[b.status]);
  }

  getStatusClass(status: string) {

    switch (status) {

      case 'CONFIRMED':
        return 'confirmed-card';

      case 'COMPLETED':
        return 'completed-card';

      case 'CANCELLED':
        return 'cancelled-card';

      default:
        return '';
    }
  }

  cancelAppointment(id: number) {

    if (!confirm('¿Cancelar esta cita?')) {
      return;
    }

    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        this.loadAdminAppointments();
      }
    });

  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data
    });
  }

  requestTherapist() {
    this.userService.requestTherapist().subscribe({
      next: () => this.loadUser()
    });
  }

  approveTherapist(id: number) {
    this.userService.makeTherapist(id).subscribe({
      next: () => {
        this.loadUsers();
        this.loadUser();
      }
    });
  }

  rejectTherapist(id: number) {
    this.userService.rejectTherapist(id).subscribe({
      next: () => {
        this.loadUsers();
        this.loadUser();
      }
    });
  }

  getRequestedUsers(): User[] {
    return this.users.filter(
      u => u.therapistRequested === true
    );
  }

  isUser() {
    return this.user?.role === 'USER';
  }

  isTherapist() {
    return this.user?.role === 'THERAPIST';
  }

  isAdmin() {
    return this.user?.role === 'ADMIN';
  }
}