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
  public showMap = false;
  public showCards = true;

  private map: any;

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

  constructor(private routesService: RoutesService) {
    this.sharedRoutes = []
  }

  ngOnInit() {
    this.getSharedRoutes();
  }

  ngAfterViewInit() {
    console.log("Social Component works");
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

    const latLngInitial = L.latLng(coordinates[0]);
    L.marker(latLngInitial, {icon: this.startGeolocationIcon}).addTo(this.map);

    L.polyline(coordinates).addTo(this.map);

    const latLngFinal = L.latLng(coordinates[coordinates.length - 1]);
    L.marker(latLngFinal, {icon: this.finalGeolocationIcon}).addTo(this.map);
  }

  returnShowCards() {
    this.showMap = false;
    this.showCards = true
  }

}
