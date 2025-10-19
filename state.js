import { AppData } from './data.js';

// This file holds the shared state for the application to avoid circular dependencies.
export let deck = [...AppData.cards];

