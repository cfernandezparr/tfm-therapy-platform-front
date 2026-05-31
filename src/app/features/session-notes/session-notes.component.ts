import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SessionService, Session } from '../../core/services/session.service';

@Component({
  selector: 'app-session-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-notes.component.html',
  styleUrls: ['./session-notes.component.scss']
})
export class SessionNotesComponent implements OnInit {

  sessionId!: number;
  session!: Session;

  notes = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {

    this.sessionId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadSession();
  }

  loadSession() {

    this.sessionService.getById(this.sessionId)
      .subscribe({
        next: (data) => {
          this.session = data;
          this.notes = data.notes || '';
        }
      });
  }

  saveNotes() {

    this.sessionService.saveNotes(
      this.sessionId,
      this.notes
    ).subscribe({

      next: () => {
        this.successMessage =
          'Notas guardadas correctamente';
      }
    });
  }
}