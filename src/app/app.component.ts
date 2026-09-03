import {
  Component
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet
  ],

  template: `

    <header class="app-header">

      <div class="app-logo">

        <img
          src="assets/logo.png"
          alt="Logo de la société"
        >

      </div>

    </header>

    <main class="app-main">

      <router-outlet />

    </main>

  `
})
export class AppComponent {}