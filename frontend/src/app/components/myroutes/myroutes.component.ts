import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';

import { SignupComponent } from '../signup/signup.component';
import { SigninComponent } from '../signin/signin.component';

import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-myroutes',
  templateUrl: './myroutes.component.html',
  styleUrls: ['./myroutes.component.css']
})
export class MyroutesComponent implements AfterViewInit {

  // objeto mapa de leaflet
  private map: any;

  // objeto que representa las rutas que el usuario
  // obtiene de la base de datos cuando realiza una busqueda 
  // por nombre de usuario o por duracion 
  routes: any[] = [];
  selectedRoute: any = null;

  // parametros de busqueda de las rutas, el nombre de usuario, 
  // la fecha de inicio de la ruta y la duracion
  pathName = '';
  userId = '';
  duration: number | null = null;

  routeStartDay: number | null = null;
  routeStartMonth: number | null = null;
  routeStartYear: number | null = null;

  // create icon object
  private startGeolocationIcon = L.icon({
    iconUrl: '../../../assets/icons/icon-location-a.png',
    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
  });

  private finalGeolocationIcon = L.icon({
    iconUrl: '../../../assets/icons//icon-location-b.png',
    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
  });

  // crea el mapa de leaflet, y le envia la capa de mosaicos
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

  selectRoute(route: any) {
    this.selectedRoute = route;
    this.drawRouteOnMap(this.selectedRoute);
  }
  
  searchRoutes(): void {
    // Validar si los campos no son números enteros
    if ((!Number.isInteger(this.duration) && (this.duration != null))) {
      alert('La duración de la ruta debe ser un número entero');
      return;
    }

    if ((!Number.isInteger(this.routeStartDay) && (this.routeStartDay != null))) {
      alert('El día de inicio de la ruta debe ser un número entero');
      return;
    }

    if ((!Number.isInteger(this.routeStartMonth) && (this.routeStartMonth != null))) {
      alert('El mes de inicio de la ruta debe ser un número entero');
      return;
    }

    if ((!Number.isInteger(this.routeStartYear) && (this.routeStartYear != null))) {
      alert('El año de inicio de la ruta debe ser un número entero');
      return;
    }

    if (SigninComponent.userName == '') {
      alert('No puede buscar rutas privadas si no ha iniciado sesión');
      return;
    }

    if (SignupComponent.userName == '') {
      alert('No puede buscar rutas privadas si no se ha registrado');
      return;
    }

    const observer: Observer<any> = {
      next: (response) => {
        this.routes = response;
      },
      error: (error) => {
        alert(error.error);
        this.router.navigate(['/myroutes']);
      },
      complete: () => {
        // Opcional: lógica a ejecutar cuando la operación asincrónica esté completa
      }
    };
  
    this.routesService.searchRoutes(this.pathName, this.userId, this.duration, this.routeStartDay, this.routeStartMonth, this.routeStartYear).subscribe(observer);
  }

  drawRouteOnMap(route: any) {
    // this.initMap();

    if (!this.map) return;

    if (!route) return;

    const coordinates: L.LatLngExpression[] = route.path.map((point: { latitude: number; longitude: number; }) => L.latLng(point.latitude, point.longitude));
    
    const latLngInitial = L.latLng(coordinates[0]);
    const markerInitial = L.marker(latLngInitial, {icon: this.startGeolocationIcon}).addTo(this.map);

    // Create a polyline using the coordinates and add it to the map
    const polyline = L.polyline(coordinates, { color: 'blue' }).addTo(this.map);

    const latLngFinal = L.latLng(coordinates[coordinates.length - 1]);
    const markerFinal = L.marker(latLngFinal, {icon: this.finalGeolocationIcon}).addTo(this.map);

    this.map.fitBounds(polyline.getBounds());
  }

  clearRoutes(): void {
    this.routes = []; // Vaciar el array de rutas
    this.selectedRoute = null; // Desseleccionar la ruta actualmente seleccionada
    // Limpiar las rutas dibujadas en el mapa (por ejemplo, utilizando Leaflet)
    // ...
    if (this.map) {
      this.map.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          this.map.removeLayer(layer); // Remove the marker or polyline layer from the map
        }
      });
    }
  }

  deleteRoute(routeId: string): void {
    console.log('Deleting route:', routeId);
    this.routesService.deleteRoute(routeId).subscribe(
      (response) => {
        console.log('Route deleted successfully:', response);
        // Eliminación exitosa, realizar acciones adicionales si es necesario
        alert('Ruta eliminada exitosamente');
        this.clearRoutes();
        this.searchRoutes();
      },
      (error) => {
        console.log('Error deleting route:', error);
        // Manejar el error, como mostrar un mensaje de error o registrarlo en la consola
        const errorMessage = error && error.message ? error.message : 'Error al eliminar la ruta';
        alert('Error al eliminar la ruta: ' + errorMessage);
        this.clearRoutes();
        this.searchRoutes();
      }
    );
  }
  
  modifyRoute(routeId: string, pathName: string, shared: boolean) {
    console.log(routeId, pathName, shared);

    // Redireccionar a otro componente y enviar datos
    this.router.navigate(['/modifyroutes'], {
      state: { routeId: routeId, pathName: pathName, shared: shared }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  constructor(private routesService: RoutesService, private router: Router) {
    if (SigninComponent.userName != '') {
      this.userId = SigninComponent.userName
    }

    if (SignupComponent.userName != '') {
      this.userId = SignupComponent.userName
    }
  }
}
