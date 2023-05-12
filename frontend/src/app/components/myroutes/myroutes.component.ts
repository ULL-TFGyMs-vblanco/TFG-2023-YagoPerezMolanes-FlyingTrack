import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-myroutes',
  templateUrl: './myroutes.component.html',
  styleUrls: ['./myroutes.component.css']
})
export class MyroutesComponent implements AfterViewInit {

  // objeto mapa de leaflet
  private map: any;

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
  
  ngAfterViewInit(): void {
    this.initMap();
  }
}
