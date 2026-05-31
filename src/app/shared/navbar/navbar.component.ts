import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user?: User;
  dropdownOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isLogged()) {
      this.loadUser();
    }
  }

  loadUser() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  requestTherapist() {
    this.userService.requestTherapist().subscribe({
      next: () => {
        this.loadUser();
        this.closeDropdown();
      }
    });
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

  logout() {
  this.user = undefined;
  this.dropdownOpen = false;

  this.authService.logout();

  window.location.href = '/login';
}

  isLogged(): boolean {
    return !!this.authService.getToken();
  }
}