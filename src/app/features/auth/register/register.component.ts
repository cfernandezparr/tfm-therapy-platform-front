import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  role: string = 'USER'; // por defecto
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.error = '';

    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.error = 'Completa todos los campos';
      return;
    }

    this.authService.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role
    }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error en registro';
      }
    });
  }
}