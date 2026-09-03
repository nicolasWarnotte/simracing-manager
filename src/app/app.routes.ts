import {
  Routes
} from '@angular/router';

import {
  RankingComponent
} from './pages/ranking/ranking.component';

import {
  ParticipantFormComponent
} from './pages/participants/participant-form.component';

import {
  ParticipantTimeComponent
} from './pages/participants/participant-time.component';

export const routes: Routes = [

  /*
   * Page d'accueil
   */
  {
    path: '',
    redirectTo: 'ranking',
    pathMatch: 'full'
  },


  /*
   * Classement
   */
  {
    path: 'ranking',
    component: RankingComponent
  },


  /*
   * Création d'un participant
   */
  {
    path: 'participants/new',
    component: ParticipantFormComponent
  },


  /*
   * Ajout / modification du temps
   */
  {
    path: 'participants/:id/time',
    component: ParticipantTimeComponent
  },


  /*
   * Toute URL inconnue
   * retourne vers le classement.
   */
  {
    path: '**',
    redirectTo: 'ranking'
  }

];