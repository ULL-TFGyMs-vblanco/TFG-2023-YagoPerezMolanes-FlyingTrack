import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements AfterViewInit {
  public sharedRoutes: any[];
  public selectedRoute: any;
  public showMap: boolean = false;
  public showCards: boolean = true;

  private map: any;

  constructor(private routesService: RoutesService) {
    this.sharedRoutes = []
  }

  ngOnInit() {
    this.getSharedRoutes();
  }

  ngAfterViewInit() {
  }

  getSharedRoutes() {
    this.routesService.getSharedRoutes()
      .subscribe(
        (routes) => {
          this.sharedRoutes = routes;
        },
        (err) => {
          console.log(err);
          alert(err.error);
        }
      );
  }

  selectRoute(route: any) {
    this.selectedRoute = route;
    this.showMap = true; // Mostrar el mapa al hacer clic en la tarjeta
    this.showCards = false;

    setTimeout(() => {
      this.showRouteOnMap();
    });

  }

  showRouteOnMap() {
    // Crear un mapa de Leaflet
    this.map = L.map('map').setView([this.selectedRoute.path[0].latitude, this.selectedRoute.path[0].longitude], 13);
  
    // Añadir capa de mapa base (por ejemplo, OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    // Dibujar la ruta en el mapa
    const coordinates = this.selectedRoute.path.map((point: { latitude: any; longitude: any; }) => [point.latitude, point.longitude]);
    L.polyline(coordinates).addTo(this.map);
  }

}
