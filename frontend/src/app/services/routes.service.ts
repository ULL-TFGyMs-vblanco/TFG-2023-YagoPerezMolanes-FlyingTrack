import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  searchRoutes(userId: string, duration: number | null): Observable<any> {
    const query = {
      userId: userId,
      duration: duration?.toString() || ''
    };

    return this.http.get<any[]>('/paths', { params: query });
  }

}
