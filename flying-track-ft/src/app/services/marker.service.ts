import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Map, Marker, CircleMarker } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = '../../assets/data/usa-capitals.geojson';

  constructor(private http: HttpClient) { }

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeCapitalMarkers(map: Map): void { 
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = new Marker([lat, lon]);
        
        marker.addTo(map);
      }
    });
  }

  makeCapitalCircleMarkers(map: Map): void {
    this.http.get(this.capitals).subscribe((res: any) => {
  
      const maxPop = Math.max(...res.features.map((x: { properties: { population: Number; }; }) => x.properties.population), 0);

      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const circle = new CircleMarker([lat, lon], { 
          radius: MarkerService.scaledRadius(c.properties.population, maxPop)
        });
        
        circle.addTo(map);
      }
    });
  }
}
