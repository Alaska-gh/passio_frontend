import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'passio-945fd',
        appId: '1:36645642297:web:c38a95f33bd34074e7ede8',
        storageBucket: 'passio-945fd.firebasestorage.app',
        apiKey: 'AIzaSyDr4BIkw9jyw2QqMXhBWXdz8XgmzupM9R8',
        authDomain: 'passio-945fd.firebaseapp.com',
        messagingSenderId: '36645642297',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
// "paths": {
//   "@core/*":     ["src/app/core/*"],
//   "@shared/*":   ["src/app/shared/*"],
//   "@features/*": ["src/app/features/*"],
//   "@env/*":      ["src/environments/*"]
// }
