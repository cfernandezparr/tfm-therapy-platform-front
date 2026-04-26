import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvailabilityService, AvailabilitySlot } from '../../core/services/availability.service';

@Component({
  selector: 'app-manage-availability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-availability.component.html',
  styleUrls: ['./manage-availability.component.scss']
})
export class ManageAvailabilityComponent implements OnInit {

  days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  hours = [9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22];

  selectedSlots: AvailabilitySlot[] = [];

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit() {
    this.loadAvailability();
  }

  loadAvailability() {
    this.availabilityService.getMyAvailability().subscribe({
      next: (data) => this.selectedSlots = data || [],
      error: (err) => console.error(err)
    });
  }

  toggleSlot(day: string, hour: number) {

    const exists = this.selectedSlots.some(
      s => s.dayOfWeek === day && s.hour === hour
    );

    if (exists) {
      
      this.selectedSlots = this.selectedSlots.filter(
        s => !(s.dayOfWeek === day && s.hour === hour)
      );
    } else {
      
      this.selectedSlots = [
        ...this.selectedSlots,
        { dayOfWeek: day, hour }
      ];
    }
  }

  isSelected(day: string, hour: number): boolean {
    return this.selectedSlots.some(
      s => s.dayOfWeek === day && s.hour === hour
    );
  }

  save() {
    this.availabilityService.saveAvailability(this.selectedSlots).subscribe({
      next: () => alert('Disponibilidad guardada'),
      error: (err) => console.error(err)
    });
  }
}