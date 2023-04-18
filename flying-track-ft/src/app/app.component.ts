import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="location">
      Latitude: {{ location.coords.latitude }}<br>
      Longitude: {{ location.coords.longitude }}
    </div>
  `
})
export class AppComponent {

  location: GeolocationPosition | any;

  constructor() {}

  ngOnInit() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('Service worker ready:', registration);
        registration.active?.postMessage('getLocation');
      }).catch(error => {
        console.error('Service worker registration failed:', error);
      });
    } else {
      console.error('Service workers not supported');
    }

    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.location) {
        this.location = event.data.location;
      } else if (event.data && event.data.error) {
        console.error('Unable to retrieve location:', event.data.error);
      }
    });
  }

}
