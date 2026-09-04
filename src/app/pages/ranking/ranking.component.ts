import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  Participant
} from '../../models/participant.model';

import {
  ParticipantService
} from '../../services/participant.service';

import {
  CsvService
} from '../../services/csv.service';

@Component({
  selector: 'app-ranking',
  standalone: true,

  imports: [
    RouterLink
  ],

  template: `

    <div class="page">

      <!-- HEADER -->

      <div class="page-header ranking-header">

        <div>

          <h1>🏆 Classement</h1>

          <p>
            {{ participantsWithTime.length }}
            participant(s) classé(s)
          </p>

        </div>

        <a
          routerLink="/participants/new"
          class="button add-button"
        >
          + Ajouter un participant
        </a>

      </div>


      <!-- CLASSEMENT -->

      @if (
        participantsWithTime.length > 0
      ) {

        <section>

          <div class="section-title">

            <span>
              Classement
            </span>

          </div>


          <div class="ranking">

            @for (
              participant of participantsWithTime;
              track participant.id;
              let i = $index
            ) {

              <div
                class="ranking-row"
                [class.podium]="i < 3"
              >

                <!-- POSITION -->

                <div class="position">

                  @if (i === 0) {

                    <span
                      class="medal"
                      aria-label="Premier"
                    >
                      🥇
                    </span>

                  } @else if (i === 1) {

                    <span
                      class="medal"
                      aria-label="Deuxième"
                    >
                      🥈
                    </span>

                  } @else if (i === 2) {

                    <span
                      class="medal"
                      aria-label="Troisième"
                    >
                      🥉
                    </span>

                  } @else {

                    {{ i + 1 }}

                  }

                </div>


                <!-- PARTICIPANT -->

                <div class="participant">

                  <strong>
                    {{ participant.firstName }}
                    {{ participant.lastName }}
                  </strong>

                  @if (participant.company) {

                    <span>
                      {{ participant.company }}
                    </span>

                  }

                </div>


                <!-- TEMPS -->

                <div class="time">

                  {{ formatTime(
                    participant.timeMs
                  ) }}

                </div>


                <!-- ACTION -->

                <a
                  class="edit-button"
                  [routerLink]="[
                    '/participants',
                    participant.id,
                    'time'
                  ]"
                  aria-label="Modifier le temps"
                >
                  Modifier
                </a>

              </div>

            }

          </div>

        </section>

      } @else {

        <div class="empty-ranking">

          <div class="empty-icon">
            🏎️
          </div>

          <h2>
            Aucun classement pour le moment
          </h2>

          <p>
            Ajoutez un participant ou encodez
            un temps pour commencer.
          </p>

        </div>

      }


      <!-- TEMPS À ENCODER -->

      @if (
        participantsWithoutTime.length > 0
      ) {

        <section
          class="pending-section"
        >

          <div class="pending-header">

            <div>

              <h2>
                ⏱️ Temps à encoder
              </h2>

              <p>
                {{ participantsWithoutTime.length }}
                participant(s) en attente
              </p>

            </div>

          </div>


          <div class="pending-list">

            @for (
              participant of participantsWithoutTime;
              track participant.id
            ) {

              <div
                class="pending-row"
              >

                <div class="participant">

                  <strong>
                    {{ participant.firstName }}
                    {{ participant.lastName }}
                  </strong>

                  @if (
                    participant.company
                  ) {

                    <span>
                      {{ participant.company }}
                    </span>

                  }

                </div>


                <a
                  class="button small-button"
                  [routerLink]="[
                    '/participants',
                    participant.id,
                    'time'
                  ]"
                >
                  Ajouter le temps
                </a>

              </div>

            }

          </div>

        </section>

      }


      <!-- ACTIONS -->

      <section class="bottom-actions">

        <button
          type="button"
          class="button button-secondary"
          (click)="exportCsv()"
        >
          📄 Exporter CSV
        </button>

      </section>

    </div>
  `
})
export class RankingComponent
  implements OnInit {

  private readonly participantService =
    inject(ParticipantService);

  private readonly csvService =
    inject(CsvService);


  participantsWithTime:
    Participant[] = [];

  participantsWithoutTime:
    Participant[] = [];


  async ngOnInit(): Promise<void> {

    await this.load();
  }


  async load(): Promise<void> {

    const participants =
      await this.participantService.getAll();


    this.participantsWithTime =
      participants
        .filter(
          participant =>
            participant.timeMs !== null
        )
        .sort(
          (a, b) =>
            (a.timeMs ?? Infinity) -
            (b.timeMs ?? Infinity)
        );


    this.participantsWithoutTime =
      participants
        .filter(
          participant =>
            participant.timeMs === null
        )
        .sort(
          (a, b) => {

            const lastNameCompare =
              a.lastName.localeCompare(
                b.lastName
              );

            if (
              lastNameCompare !== 0
            ) {
              return lastNameCompare;
            }

            return a.firstName.localeCompare(
              b.firstName
            );
          }
        );
  }


  formatTime(
    timeMs: number | null
  ): string {

    if (timeMs === null) {
      return '-';
    }

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


  exportCsv(): void {

    const allParticipants = [
      ...this.participantsWithTime,
      ...this.participantsWithoutTime
    ];

    this.csvService.exportParticipants(
      allParticipants
    );
  }
}