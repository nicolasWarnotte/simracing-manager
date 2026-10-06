export interface Participant {
  id: string;

  firstName: string;
  lastName: string;
  

  /**
   * Temps en millisecondes.
   *
   * null = aucun temps encore enregistré.
   */
  timeMs: number | null;

  createdAt: number;
}