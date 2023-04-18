import { Component, AfterViewInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { Platform } from '@angular/cdk/platform';
import { filter, map } from 'rxjs/operators';
import * as L from 'leaflet';
import { Map } from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { Geolocation, Position } from '@capacitor/geolocation';
import * as Lo from 'leaflet.locatecontrol';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;

  title = 'Offline-Map';

  private map: Map | any;
  public location: Position | any;

  private initMap(): void {
    if (!navigator.geolocation) {
      console.log('location is not supported');
    }

    this.map = L.map('map', {
      center: [ 29.023152, -13.647079 ],
      zoom: 3
    })

    const tiles = L.tileLayer("../assets/data/Canarias/{z}/{x}/{y}.png", {
      maxZoom: 10,
      minZoom: 7,
    });

    tiles.addTo(this.map);

    

    // console.log(this.map.locate({setView: true, maxZoom: 10, watch: true}));

    // let marker = L.marker([ 29.023152, -13.647079 ]).addTo(this.map);

    // navigator.geolocation.getCurrentPosition((position) => {
    //   const coords = position.coords;
    //   const latLong = [coords.latitude, coords.longitude];
    //   console.log(
    //     `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
    //   );

    //   this.map = L.map('map', {
    //     center: [ 29.023152, -13.647079 ],
    //     zoom: 3
    //   });

    //   const tiles = L.tileLayer('./assets/data/Canarias/{z}/{x}/{y}.png', {
    //     maxZoom: 10,
    //     minZoom: 7,
    //   });

    //   tiles.addTo(this.map);

    //   // let marker = L.marker(latLong as LatLngExpression).addTo(this.map);

    //   // marker.bindPopup('<b>Hi</b>').openPopup();

    //   // let popup = L.popup().setLatLng(latLong as LatLngExpression).setContent('Estoy aqui').openOn(this.map);
    // });

    // // this.watchPosition();

  }


  constructor(private platform: Platform,private swUpdate: SwUpdate) { 
    this.isOnline = false;
    this.modalVersion = false;
  }

  ngAfterViewInit(): void {
    this.updateOnlineStatus();

    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        }),
      );
    } 
    this.loadModalPwa();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../../geolocation-worker.js').then(registration => {
        console.log('Service worker registered:', registration);
        navigator.serviceWorker.controller?.postMessage('getLocation');
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


    this.initMap();
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }

  watchPosition() {
    let desLat = 0;
    let desLon = 0;
    let id = navigator.geolocation.watchPosition(
      (position) => {
        console.log(
          `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
        );
        if (position.coords.latitude === desLat) {
          navigator.geolocation.clearWatch(id);
        }
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: false,
        timeout: 100000,
        maximumAge: 0,
      }
    );
  }
}
