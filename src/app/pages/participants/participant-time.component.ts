import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  Participant
} from '../../models/participant.model';

import {
  ParticipantService
} from '../../services/participant.service';

@Component({
  selector: 'app-participant-time',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  template: `

    <div class="page">

      @if (loading) {

        <div class="loading">
          Chargement...
        </div>

      } @else if (!participant) {

        <div class="empty">

          <h1>Participant introuvable</h1>

          <a
            routerLink="/ranking"
            class="button"
          >
            Retour au classement
          </a>

        </div>

      } @else {

        <div class="page-header">

          <div>

            <h1>
              {{ participant.timeMs === null
                ? 'Ajouter le temps'
                : 'Modifier le temps'
              }}
            </h1>

            <p>
              {{ participant.firstName }}
              {{ participant.lastName }}
            </p>

            @if (participant.company) {

              <span class="participant-company">
                {{ participant.company }}
              </span>

            }

          </div>

        </div>


        <div class="time-form">

          <label for="time">
            Temps réalisé
          </label>

          <input
            id="time"
            type="text"
            [(ngModel)]="time"
            inputmode="decimal"
            placeholder="1.32.421"
            autofocus
          >

          <small class="hint">
            Format : M.SS.mmm
          </small>

          @if (timeError) {

            <small class="error">
              Format invalide.
              Exemple : 1.32.421
            </small>

          }

        </div>


        <div class="form-actions">

          <a
            routerLink="/ranking"
            class="button button-secondary"
          >
            Annuler
          </a>

          <button
            type="button"
            class="button"
            (click)="save()"
          >
            Enregistrer
          </button>

        </div>

      }

    </div>
  `
})
export class ParticipantTimeComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly participantService =
    inject(ParticipantService);


  participant:
    Participant | undefined;

  time = '';

  timeError = false;

  loading = true;


  async ngOnInit(): Promise<void> {

    const id =
      this.route.snapshot.paramMap.get(
        'id'
      );

    if (!id) {

      this.loading = false;

      return;
    }

    this.participant =
      await this.participantService.getById(
        id
      );

    if (
      this.participant &&
      this.participant.timeMs !== null
    ) {

      this.time =
        this.formatTime(
          this.participant.timeMs
        );
    }

    this.loading = false;
  }


  async save(): Promise<void> {

    this.timeError = false;

    if (!this.participant) {
      return;
    }

    const value =
      this.time.trim();

    const timeMs =
      this.parseTime(value);

    if (timeMs === null) {

      this.timeError = true;

      return;
    }

    this.participant.timeMs =
      timeMs;

    await this.participantService.save(
      this.participant
    );

    await this.router.navigate([
      '/ranking'
    ]);
  }


  private parseTime(
    value: string
  ): number | null {

    const match =
      value.match(
        /^(\d{1,2})\.(\d{2})\.(\d{3})$/
      );

    if (!match) {
      return null;
    }

    const minutes =
      Number(match[1]);

    const seconds =
      Number(match[2]);

    const milliseconds =
      Number(match[3]);

    if (
      seconds < 0 ||
      seconds >= 60
    ) {
      return null;
    }

    return (
      minutes * 60000 +
      seconds * 1000 +
      milliseconds
    );
  }


  private formatTime(
    timeMs: number
  ): string {

    const minutes =
      Math.floor(
        timeMs / 60000
      );

    const seconds =
      Math.floor(
        (timeMs % 60000) / 1000
      );

    const milliseconds =
      timeMs % 1000;

    return (
      `${minutes}.` +
      `${String(seconds).padStart(2, '0')}.` +
      `${String(milliseconds).padStart(3, '0')}`
    );
  }
}