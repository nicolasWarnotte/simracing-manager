import { Injectable } from '@angular/core';
import {
  DBSchema,
  IDBPDatabase,
  openDB
} from 'idb';

import { Participant } from '../models/participant.model';

interface SimracingDB extends DBSchema {
  participants: {
    key: string;
    value: Participant;
    indexes: {
      'by-createdAt': number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private readonly dbPromise:
    Promise<IDBPDatabase<SimracingDB>>;

  constructor() {
    this.dbPromise = openDB<SimracingDB>(
      'simracing-db',
      1,
      {
        upgrade(db) {

          if (!db.objectStoreNames.contains('participants')) {

            const store =
              db.createObjectStore(
                'participants',
                {
                  keyPath: 'id'
                }
              );

            store.createIndex(
              'by-createdAt',
              'createdAt'
            );
          }
        }
      }
    );
  }

  async getAll(): Promise<Participant[]> {

    const db =
      await this.dbPromise;

    return db.getAll(
      'participants'
    );
  }

  async getById(
    id: string
  ): Promise<Participant | undefined> {

    const db =
      await this.dbPromise;

    return db.get(
      'participants',
      id
    );
  }

  async save(
    participant: Participant
  ): Promise<void> {

    const db =
      await this.dbPromise;

    await db.put(
      'participants',
      participant
    );
  }

  async delete(
    id: string
  ): Promise<void> {

    const db =
      await this.dbPromise;

    await db.delete(
      'participants',
      id
    );
  }

  async deleteAll(): Promise<void> {

    const db =
      await this.dbPromise;

    await db.clear(
      'participants'
    );
  }
}