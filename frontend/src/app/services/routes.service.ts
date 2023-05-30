import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private URL: string = 'https://trick-tracking-app-backend.herokuapp.com';

  constructor(private http: HttpClient) { }

  saveRoute(path: any): Observable<any>{
    return this.http.post<any>(this.URL + '/paths', path);
  }

  searchRoutes(userId: string, duration: number | null, routeStartDay: number | null, routeStartMonth: number | null, routeStartYear: number | null): Observable<any> {
    const query = {
      userId: userId,
      duration: duration?.toString() || '',
      routeStartDay: routeStartDay?.toString() || '',
      routeStartMonth: routeStartMonth?.toString() || '',
      routeStartYear: routeStartYear?.toString() || ''
    };

    return this.http.get<any[]>(this.URL + '/paths', { params: query });
  }

}
