import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Observer } from 'rxjs';

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
  userId: string = '';
  duration: number | null = null;

  routeStartDay: number | null = null;
  routeStartMonth: number | null = null;
  routeStartYear: number | null = null;

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
    const observer: Observer<any> = {
      next: (response) => {
        this.routes = response;
      },
      error: (error) => {
        alert(error);
      },
      complete: () => {
        // Opcional: lógica a ejecutar cuando la operación asincrónica esté completa
      }
    };
  
    this.routesService.searchRoutes(this.userId, this.duration, this.routeStartDay, this.routeStartMonth, this.routeStartYear).subscribe(observer);
  }

  drawRouteOnMap(route: any) {
    // this.initMap();

    if (!this.map) return;

    if (!route) return;

    const coordinates: L.LatLngExpression[] = route.path.map((point: { latitude: number; longitude: number; }) => L.latLng(point.latitude, point.longitude));

    // Create a polyline using the coordinates and add it to the map
    const polyline = L.polyline(coordinates, { color: 'blue' }).addTo(this.map);
    this.map.fitBounds(polyline.getBounds());
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  constructor(private routesService: RoutesService) {
    if (SigninComponent.userName != '') {
      this.userId = SigninComponent.userName
    }

    if (SignupComponent.userName != '') {
      this.userId = SignupComponent.userName
    }
  }
}
