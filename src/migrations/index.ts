import * as migration_20260922_024735_initial from './20260922_024735_initial';

export const migrations = [
  {
    up: migration_20260922_024735_initial.up,
    down: migration_20260922_024735_initial.down,
    name: '20260922_024735_initial'
  },
];
