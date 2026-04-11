import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
// "paths": {
//   "@core/*":     ["src/app/core/*"],
//   "@shared/*":   ["src/app/shared/*"],
//   "@features/*": ["src/app/features/*"],
//   "@env/*":      ["src/environments/*"]
// }