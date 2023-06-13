import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import * as L from 'leaflet';
// importamos la liberia leaflet

import { SignupComponent } from '../signup/signup.component';
import { SigninComponent } from '../signin/signin.component';

import { RoutesService } from 'src/app/services/routes.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements AfterViewInit {

  // objeto mapa de leaflet
  private map: any;

  // atributos que se usan para el seguimiento en tiempo real, de cara al html
  public actualLtd: number;
  public actualLng: number;
  public actualAlt: number | null;
  public actualHead: number | null;
  public actualSpeed: number | null;

  private markerCount: number;

  // fechas de inicio del tracking y de finalizacion
  private startDate: any;
  private endDate: any;

  // contador del numero de velocidades y altitudes calculadas en la ruta
  private countSpeed = 0;
  private countAltitude = 0;

  // suma de los valores de las velocidades y altitudes calculadas en la ruta
  private sumSpeed = 0;
  private sumAltitude = 0;

  public pathName = "";
  public shareRoute = false;

  public maxSpeed = 0;
  public minSpeed = 0;
  public maxAltitude = 0;
  public minAltitude = 0;

  // objeto que represetna la ruta, que se va a enviar al servidor
  path = {
    "pathName": '',
    "userId": '',
    "path": [
      {
        "latitude": 0,
        "longitude": 0
      },
    ],
    "duration": 0,
    "averageSpeed": 0,
    "meanAltitude": 0,
    "routeStartDay": 1,
    "routeStartMonth": 1,
    "routeStartYear": 2023,
    "shared": false,
    "maxSpeed": 0,
    "minSpeed": 0,
    "maxAltitude": 0,
    "minAltitude": 0,
  }
  
  // Opciones para el calculo de la geolocalizacion inicial, incluye la precision deseada de los datos de 
  // geolocalizacion, la cantidad maxima que tiene que esperar para recibir los datos de geolocalizacion
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
    iconUrl: '../../../assets/icons/icon-track.png',
    iconSize: [10, 10], // size of the icon
    iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
  });

  // crea el mapa de leaflet, y le envia la capa de mosaicos
  private initMap(): void {

    const geolocationIcon = L.icon({
      iconUrl: '../../../assets/icons/icon-geolocation.png',
      iconSize: [40, 40], // size of the icon
      iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
    });

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

    // Crear un botón personalizado
    const CustomButton = L.Control.extend({
      onAdd: function(map: any) {
        // Crear el elemento del botón
        const button = L.DomUtil.create('button', 'custom-button');
        const icon = L.DomUtil.create('i', 'fas fa-map-marker-alt'); // Cambia la clase del icono según tus necesidades
        button.appendChild(icon);
      
        // Agregar evento click al botón
        L.DomEvent.on(button, 'click', () => {
          if (navigator.geolocation) {
              // sonarlint-ignore-next-line - La geolocalización es necesaria para obtener la ubicación actual del usuario
            navigator.geolocation.getCurrentPosition((position) => {
              const latLng: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
              L.marker(latLng, {icon: geolocationIcon}).addTo(map);
      
              map.setView(latLng, 16);

            
            });
          } else {
            alert('La geolocalización no está permitida en tu dispositivo');
          }
        });
      
        return button;
      }
    });
    

    // Agregar el botón personalizado al mapa
    this.map.addControl(new CustomButton({ position: 'topright' }));

  }

  // calcula la geolocalizacion inicial y la muestra en el mapa
  private async getInitialLocation(): Promise<void> {
    try {
      const position: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
                      // sonarlint-ignore-next-line - La geolocalización es necesaria para obtener la ubicación actual del usuario
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
          reject(error);
        }, this.options);
      });
  
      // obtiene los valores de la posicion y establece la vista del mapa sobre ellos, despues
      // actualiza los valores de la informacion, y anade un marcador al mapa
      const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
      this.map.setView(latLng, 9);

      this.actualLtd = position.coords.latitude;
      this.actualLng = position.coords.longitude;
      this.actualAlt = Number(position.coords.altitude?.toFixed(3));
      this.actualHead = Number(position.coords.heading?.toFixed(3));
      this.actualSpeed = Number(position.coords.speed?.toFixed(3));

      this.maxSpeed = -1;
      this.minSpeed = 999;
      this.maxAltitude = -1;
      this.minAltitude = 999;

      L.marker(latLng, {icon: this.geolocationIcon}).addTo(this.map);
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

  // inicia un tracking de la posicion del usuario, y la muestra en el mapa
  trackPosition(): void {
    // asigna la fecha actual 
    this.startDate =  new Date();
    this.path.routeStartDay = new Date().getDate();
    this.path.routeStartMonth = new Date().getMonth() + 1;
    this.path.routeStartYear = new Date().getFullYear();

    // crea en objeto para pintar la ruta
    const path: L.LatLngExpression[] = [];
    const polyline = L.polyline(path, {color: 'red'}).addTo(this.map);

    if (navigator.geolocation) {
      // sonarlint-ignore-next-line - La geolocalización es necesaria para obtener la ubicación actual del usuario
      navigator.geolocation.watchPosition((position) => {
        const latLng: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
        L.marker(latLng, {icon: this.trackingUserIcon}).addTo(this.map);
        L.circle(latLng, {
          radius: position.coords.accuracy,
          color: 'purple',
          opacity: 0.3,
          fillOpacity: 0.1
        }).addTo(this.map);
        path.push(latLng);
        polyline.setLatLngs(path);

        // actualiza los valores de los datos de geolocalizacion, de cara al html
        this.actualLtd = position.coords.latitude;
        this.actualLng = position.coords.longitude;
        // para que no aparezcan tantos decimales
        this.actualAlt = Number(position.coords.altitude?.toFixed(3));
        this.actualHead = Number(position.coords.heading?.toFixed(3));
        this.actualSpeed = Number(position.coords.speed?.toFixed(3));

        if (Number.isNaN(this.actualSpeed)) {
          this.actualSpeed = 0;
        }

        if (Number.isNaN(this.actualAlt)) {
          this.actualAlt = 0;
        }

        // anade un objeto de localizacion al vector del objeto path 
        const actualCoords = {
          latitude : this.actualLtd,
          longitude : this.actualLng,
          speed: this.actualSpeed,
          altitude: this.actualAlt
        };

        // aqui suma el contador del numero de velocidades y alturas, y suma los valores
        // para despues calcular la media 

        if (position.coords.speed != null) {
          this.countSpeed += 1;
          this.sumSpeed += position.coords.speed;
        }

        if (position.coords.altitude != null) {
          this.countAltitude += 1;
          this.sumAltitude += position.coords.altitude;
        }

        if (this.maxSpeed <= this.actualSpeed) {
          this.maxSpeed = this.actualSpeed;
        }

        if (this.minSpeed >= this.actualSpeed) {
          this.minSpeed = this.actualSpeed;
        }

        if (this.maxAltitude < this.actualAlt) {
          this.maxAltitude = this.actualAlt;
        }

        if (this.minAltitude > this.actualAlt) {
          this.minAltitude = this.actualAlt;
        }

        if (this.maxSpeed == null) {
          this.maxSpeed = 0;
        }

        if (this.minSpeed == null) {
          this.minSpeed = 0;
        }

        this.path.path.push(actualCoords);
      
      });
    } else {
      alert('La geolocalización no está permitida en tu dispositivo');
    }
  }

  // finaliza el tracking de la posicion del usuario, envia el objeto path al servidor
  // a traves de un servicio de angular  
  endPosition(): void {
    // esta seria la fecha final del tracking para calcular la duracion de la ruta
    // y pasarla al objeto path
    this.endDate = new Date();

    const subMiliseconds = this.endDate.getTime() - this.startDate.getTime();
    const subMinutes = Math.round(subMiliseconds / 60000);

    this.path.duration = subMinutes;

    // calcula la velocidad y altura medias y se las pasa al objeto path
    if (this.sumSpeed != 0 && this.countSpeed != 0) {
      const averageSpeed = this.sumSpeed / this.countSpeed;
      this.path.averageSpeed = Number(averageSpeed.toFixed(3));
    }

    const meanAltitude = this.sumAltitude / this.countAltitude;
    this.path.meanAltitude = Number(meanAltitude.toFixed(3));

    this.path.pathName = this.pathName;
    this.path.shared = this.shareRoute;

    this.path.maxSpeed = this.maxSpeed;
    this.path.minSpeed = this.minSpeed;

    this.path.maxAltitude = this.maxAltitude;
    this.path.minAltitude = this.minAltitude;

    const observer: Observer<any> = {
      next: (response) => {
        console.log(response);
        this.router.navigate(['/myroutes']);
      },
      error: (error) => {
        alert(error.error);
        this.router.navigate(['/home']);
      },
      complete: () => {
        // Opcional: lógica a ejecutar cuando la operación asincrónica esté completa
      }
    };

    this.routesService.saveRoute(this.path).subscribe(observer);
    
  }

  cancelPosition(): void {
    //aqui a ver si hay alguna manera de refrescar la pagina
    this.router.navigate(['/home']);
  }

  
  constructor(private routesService: RoutesService, private router: Router) { 
    // inicializa los atributos que se van a mostrar en el html a 0
    this.actualLtd = 0;
    this.actualLng = 0;
    this.actualAlt = 0;
    this.actualHead = 0;
    this.actualSpeed = 0;
    this.markerCount = 0;

    // establece el nombre de usuario para el objeto path

    if (SigninComponent.userName != '') {
      this.path.userId = SigninComponent.userName
    }

    if (SignupComponent.userName != '') {
      this.path.userId = SignupComponent.userName
    }
    // quita el primer elemento del vector de posiciones ya que es 0 en el objeto path
    this.path.path.pop();
  }

  // primero crea el mapa con los mosaicos y despues anade un marcador con la posicion
  // actual del usuario, calcula la geolocalizacion inicial
  ngAfterViewInit(): void {
    this.initMap();
    this.getInitialLocation()
      .then(() => {
        console.log("All is ready");
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
