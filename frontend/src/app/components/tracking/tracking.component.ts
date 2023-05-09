import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
// importamos la liberia leaflet

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements AfterViewInit {

  private map: any;
  public actualLtd: number;
  public actualLng: number;
  public actualAlt: number | null;
  public actualHead: number | null;
  public actualSpeed: number | null;

  private markers: any[] = [];
  private markerCount: number;
  
  // Opciones para el calculo de la geolocalizacion inicial, incluye
  // la precision deseada de los datos de geolocalizacion, la cantidad
  // maxima que tiene que esperar para recibir los datos de geolocalizacion
  // y la antiguedad maxima de los datos de ubicacion
  private options = {
    enableHighAccuracy: true,
    timeout: 7000,
    maximumAge: 0
  };

  // create icon object
  private geolocationIcon = L.icon({
    iconUrl: '../../../assets/icons/icon-geolocation.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
  });

    // create icon object
    private trackingUserIcon = L.icon({
      iconUrl: '../../../assets/icons/icon-track.jpg',
      iconSize: [40, 40], // size of the icon
      iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
    });


  private initMap(): void {

    this.map = L.map('map', {
      center: [ 0, 0 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    const container = this.map.getContainer();
    container.parentElement.style.position = 'relative';
  }

  private async getInitialLocation(): Promise<void> {
    try {
      const position: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
          reject(error);
        }, this.options);
      });
  
      const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
      this.map.setView(latLng, 9);

      this.actualLtd = position.coords.latitude;
      this.actualLng = position.coords.longitude;
      this.actualAlt = position.coords.altitude;
      this.actualHead = position.coords.heading;
      this.actualSpeed = position.coords.speed;

      const marker = L.marker(latLng, {icon: this.geolocationIcon}).addTo(this.map);
    } catch (error: any) {
      if (error.code === 1) {
        alert('Permission denied: ' + error.message);
      } else if (error.code === 2) {
        alert('Position unavailable: ' + error.message);
      } else {
        alert('Error getting location: ' + error.message);
      }
    }
  }

  trackPosition() {
    let path: L.LatLngExpression[] = [];
    const polyline = L.polyline(path, {color: 'red'}).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const latLng: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
        const marker = L.marker(latLng, {icon: this.trackingUserIcon}).addTo(this.map);
        const circle = L.circle(latLng, {
          radius: position.coords.accuracy,
          color: 'blue',
          opacity: 0.3,
          fillOpacity: 0.1
        }).addTo(this.map);
        path.push(latLng);
        polyline.setLatLngs(path);
        this.map.setView(latLng, 16);
        
        this.actualLtd = position.coords.latitude;
        this.actualLng = position.coords.longitude;
        this.actualAlt = position.coords.altitude;
        this.actualHead = position.coords.heading;
        this.actualSpeed = position.coords.speed;

      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }

  
  constructor() { 
    this.actualLtd = 0;
    this.actualLng = 0;
    this.actualAlt = 0;
    this.actualHead = 0;
    this.actualSpeed = 0;
    this.markerCount = 0;
  }

  // primero crea el mapa con los mosaicos y despues anade un marcador con la posicion
  // actual del usuario
  ngAfterViewInit(): void {
    this.initMap();
    this.getInitialLocation();
      // Add click event listener to map
    this.map.on('click', (event: any) => {
      if (this.markerCount == 0) {
        const latlng = event.latlng;
        const marker = L.marker(latlng, {icon: this.geolocationIcon}).addTo(this.map);
        this.markers.push(marker);
        this.markerCount += 1;
      } else {
        return;
      }
    });
  }

}
