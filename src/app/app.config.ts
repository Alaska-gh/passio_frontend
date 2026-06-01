import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';

// NgRx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  getFirestore,
  provideFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
} from '@angular/fire/firestore';
import { getFunctions, provideFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import { routes } from './app.routes';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { metaReducers, reducers } from '@core/store';
import { AuthEffects } from '@core/store/auth/auth.effects';
import { SchedulesEffects } from '@core/store/schedules/schedules.effects';
import { BusesEffects } from '@core/store/buses/buses.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { environment } from '@env/environment';
import { MessageService } from 'primeng/api';
import { ToastEffects } from '@core/store/toast/toast.effects';
import { ActiveRouteEffects } from '@core/store/routes/route.effects';
import { getApp } from 'firebase/app';
import { TripsEffects } from '@core/store/trips/trips.effects';
import { TicketEffects } from '@core/store/tickets/tickets.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none',
        },
      },
    }),
    // Router
    provideRouter(
      routes,
      withComponentInputBinding(), // lets you bind route params as @Input()
      withViewTransitions(), // smooth page transitions
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),

    // HTTP
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    //  Animations
    provideAnimations(),

    //  NgRx Store
    provideStore(reducers, { metaReducers }), 

    provideEffects([AuthEffects, SchedulesEffects, TripsEffects, TicketEffects, BusesEffects, ToastEffects, ActiveRouteEffects]),

    // Redux DevTools — only in dev mode
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
    }),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideAuth(() => {
      const auth = getAuth();
      return auth;
    }),

    provideFirestore(() => getFirestore(getApp())),
    

    provideFunctions(() => {
      const fns = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(fns, 'localhost', 5001);
      }
      return fns;
    }),

    provideStorage(() => {
      const storage = getStorage();
      if (environment.useEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),

    provideMessaging(() => getMessaging()),

    // PWA Service Worker
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
