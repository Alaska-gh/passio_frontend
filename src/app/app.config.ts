import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

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
  ],
};
// "paths": {
//   "@core/*":     ["src/app/core/*"],
//   "@shared/*":   ["src/app/shared/*"],
//   "@features/*": ["src/app/features/*"],
//   "@env/*":      ["src/environments/*"]
// }