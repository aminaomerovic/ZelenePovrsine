import { bootstrapApplication } from '@angular/platform-browser';
import * as L from 'leaflet';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Angular build pokvari relativne putanje do podrazumevanih Leaflet ikonica markera
// (zato se vide upitnici umesto pravih markera) - resavamo tako sto ih vucemo sa CDN-a
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));