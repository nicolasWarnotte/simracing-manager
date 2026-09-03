export interface Participant {
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;

  /**
   * Temps en millisecondes.
   *
   * null = aucun temps encore enregistré.
   */
  timeMs: number | null;

  createdAt: number;
}