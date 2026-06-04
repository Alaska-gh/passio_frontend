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
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { getFunctions, provideFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import { routes } from './app.routes';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { metaReducers, reducers } from '@core/store';
import { AuthEffects } from '@core/store/auth/auth.effects';
import { BusesEffects } from '@core/store/buses/buses.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { environment } from '@env/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastEffects } from '@core/store/toast/toast.effects';
import { ActiveRouteEffects } from '@core/store/routes/route.effects';
import { getApp } from 'firebase/app';
import { TripsEffects } from '@core/store/trips/trips.effects';
import { TicketEffects } from '@core/store/tickets/tickets.effects';
import { ConfirmDialogEffects } from '@core/store/dialog/confirm-dialog.effects';

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
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(), // smooth page transitions
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    provideAnimations(),

    provideStore(reducers, { metaReducers }), 

    provideEffects([
      AuthEffects,
      TripsEffects, 
      TicketEffects, 
      BusesEffects, 
      ToastEffects, 
      ActiveRouteEffects, 
      BusesEffects,
      ConfirmDialogEffects
    ]),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
    }),

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

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    
    ConfirmationService
  ],
};
