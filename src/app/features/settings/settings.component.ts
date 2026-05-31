import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user!: User;
  avatarUrl: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.avatarUrl = data.avatarUrl || '';
      }
    });
  }

  updateAvatar() {
    if (!this.avatarUrl) return;

    this.userService.updateAvatar(this.avatarUrl).subscribe({
      next: () => {
        this.user.avatarUrl = this.avatarUrl;
      }
    });
  }
}