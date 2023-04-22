import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  constructor() {}

  ngOnInit() {
    if ('serviceWorker' in navigator) {
      console.log("hola");
      navigator.serviceWorker.register('geolocation-worker.js')
        .then(registration => {
          console.log("holaa");
          if (navigator.serviceWorker.controller) {
            // Service worker already controlling this page
            console.log("holaaa");
            this.sendLocationRequest(registration.active);
          } else {
            // Service worker is not yet controlling this page
            registration.addEventListener('controllerchange', () => {
              this.sendLocationRequest(navigator.serviceWorker.controller);
            });
          }
        })
        .catch(error => {
          console.error('Error registering service worker:', error);
        });
    } else {
      console.log('Service workers are not supported.');
    }
    

    
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data.type === 'location') {
        // Handle the location data
        const latitude = event.data.latitude;
        const longitude = event.data.longitude;
        console.log("llegamos");
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }
    });
    
  }

  sendLocationRequest(controller: ServiceWorker | null) {
    if (controller) {
      console.log("yago");
      console.log(controller.postMessage('get-location'));
    }
  }


}
