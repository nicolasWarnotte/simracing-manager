import {
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  ParticipantService
} from '../../services/participant.service';

@Component({
  selector: 'app-participant-form',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  template: `

    <div class="page">

      <div class="page-header">

        <div>

          <h1>Ajouter un participant</h1>

          <p>
            Encodez les informations du participant.
            Le temps peut être ajouté plus tard.
          </p>

        </div>

      </div>


      <form
        [formGroup]="form"
        (ngSubmit)="save()"
        class="participant-form"
      >

        <!-- PRÉNOM -->

        <div class="field">

          <label for="firstName">
            Firstname/Vorname
          </label>

          <input
            id="firstName"
            type="text"
            formControlName="firstName"
            autocomplete="given-name"
            placeholder="Jean"
          >

          @if (
            form.controls.firstName.touched &&
            form.controls.firstName.invalid
          ) {

            <small class="error">
              Le prénom est obligatoire.
            </small>

          }

        </div>


        <!-- NOM -->

        <div class="field">

          <label for="lastName">
            Lastname/Nachname
          </label>

          <input
            id="lastName"
            type="text"
            formControlName="lastName"
            autocomplete="family-name"
            placeholder="Dupont"
          >

          @if (
            form.controls.lastName.touched &&
            form.controls.lastName.invalid
          ) {

            <small class="error">
              Le nom est obligatoire.
            </small>

          }

        </div>


        <!-- EMAIL -->

        <div class="field">

          <label for="email">
            Email/E-Mail
          </label>

          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            placeholder="jean@entreprise.be"
          >

          @if (
            form.controls.email.touched &&
            form.controls.email.invalid
          ) {

            <small class="error">
              L'adresse email n'est pas valide.
            </small>

          }

        </div>


        <!-- TÉLÉPHONE -->

        <div class="field">

          <label for="phone">
            Phone/Telefon
          </label>

          <input
            id="phone"
            type="tel"
            formControlName="phone"
            autocomplete="tel"
            placeholder="0470 00 00 00"
          >

        </div>


        <!-- SOCIÉTÉ -->

        <div class="field">

          <label for="company">
            Company/Firma
          </label>

          <input
            id="company"
            type="text"
            formControlName="company"
            autocomplete="organization"
            placeholder="Nom de la société"
          >

        </div>


        <!-- FONCTION -->

        <div class="field">

          <label for="role">
            Role/Funktion
          </label>

          <input
            id="role"
            type="text"
            formControlName="role"
            placeholder="CEO, Manager, etc."
          >

        </div>


        <!-- TEMPS -->

        <div class="field">

          <label for="time">
            Time/Erreichte Zeit
            <span class="optional">
              (facultatif)
            </span>
          </label>

          <input
            id="time"
            type="text"
            formControlName="time"
            inputmode="decimal"
            placeholder="1.32.421"
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


        <!-- ACTIONS -->

        <div class="form-actions">

          <a
            routerLink="/ranking"
            class="button button-secondary"
          >
            Annuler
          </a>

          <button
            type="submit"
            class="button"
            [disabled]="form.invalid"
          >
            Enregistrer
          </button>

        </div>

      </form>

    </div>
  `
})
export class ParticipantFormComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly participantService =
    inject(ParticipantService);

  private readonly router =
    inject(Router);

  timeError = false;

  form =
    this.fb.nonNullable.group({

      firstName: [
        '',
        Validators.required
      ],

      lastName: [
        '',
        Validators.required
      ],

      email: [
        '',
        Validators.email
      ],

      phone: [
        ''
      ],

      company: [
        ''
      ],

      role: [
        ''
      ],

      // IMPORTANT :
      // pas de Validators.required
      time: [
        ''
      ]
    });


  async save(): Promise<void> {

    this.timeError = false;

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    const value =
      this.form.getRawValue();

    const timeValue =
      value.time.trim();

    let timeMs:
      number | null = null;

    if (timeValue) {

      timeMs =
        this.parseTime(
          timeValue
        );

      if (timeMs === null) {

        this.timeError = true;

        return;
      }
    }

    await this.participantService.save({

      id:
        crypto.randomUUID(),

      firstName:
        value.firstName.trim(),

      lastName:
        value.lastName.trim(),

      email:
        value.email.trim(),

      phone:
        value.phone.trim(),

      company:
        value.company.trim(),

      role:
        value.role.trim(),

      timeMs,

      createdAt:
        Date.now()
    });

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
}