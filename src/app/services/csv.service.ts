import { Injectable } from '@angular/core';

import {
  Participant
} from '../models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  exportParticipants(
    participants: Participant[]
  ): void {

    const sorted =
      [...participants].sort(
        (a, b) => {

          // Les participants avec temps
          // passent avant ceux sans temps.

          if (
            a.timeMs === null &&
            b.timeMs === null
          ) {
            return a.lastName.localeCompare(
              b.lastName
            );
          }

          if (a.timeMs === null) {
            return 1;
          }

          if (b.timeMs === null) {
            return -1;
          }

          return a.timeMs - b.timeMs;
        }
      );

    const headers = [
      'Position',
      'Nom',
      'Prénom',
      'Email',
      'Téléphone',
      'Société',
      'Fonction',
      'Temps'
    ];

    let position = 0;

    const rows =
      sorted.map(
        participant => {

          let participantPosition = '';

          if (
            participant.timeMs !== null
          ) {
            position++;
            participantPosition =
              String(position);
          }

          return [
            participantPosition,
            participant.lastName,
            participant.firstName,
            participant.email,
            participant.phone,
            participant.company,
            participant.role,
            this.formatTime(
              participant.timeMs
            )
          ];
        }
      );

    const csv =
      [
        headers,
        ...rows
      ]
        .map(
          row =>
            row
              .map(
                value =>
                  `"${this.escapeCsvValue(value)}"`
              )
              .join(';')
        )
        .join('\r\n');

    // BOM pour assurer une bonne ouverture
    // dans Excel avec les accents.

    const blob =
      new Blob(
        [
          '\ufeff',
          csv
        ],
        {
          type:
            'text/csv;charset=utf-8'
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      `simracing-${this.getDate()}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  private escapeCsvValue(
    value: unknown
  ): string {

    return String(
      value ?? ''
    ).replace(
      /"/g,
      '""'
    );
  }

  formatTime(
    timeMs: number | null
  ): string {

    if (timeMs === null) {
      return '';
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
      `${String(minutes).padStart(2, '0')}:` +
      `${String(seconds).padStart(2, '0')}.` +
      `${String(milliseconds).padStart(3, '0')}`
    );
  }

  private getDate(): string {

    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        now.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}