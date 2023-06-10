import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private URL = 'https://trick-tracking-app-backend.herokuapp.com';

  constructor(private http: HttpClient) { }

  saveRoute(path: any): Observable<any>{
    return this.http.post<any>(this.URL + '/paths', path);
  }

  searchRoutes(pathName: string | null, userId: string, duration: number | null, routeStartDay: number | null, routeStartMonth: number | null, routeStartYear: number | null): Observable<any> {
    const query = {
      pathName: pathName?.toString() || '',
      userId: userId,
      duration: duration?.toString() || '',
      routeStartDay: routeStartDay?.toString() || '',
      routeStartMonth: routeStartMonth?.toString() || '',
      routeStartYear: routeStartYear?.toString() || ''
    };

    return this.http.get<any[]>(this.URL + '/myPaths', { params: query });
  }

  getSharedRoutes(): Observable<any> {

    return this.http.get<any>(this.URL + '/social');
  }

  deleteRoute(routeId: string): Observable<any> {
    return this.http.delete(this.URL + '/paths/' + routeId)
      .pipe(
        catchError((error: any) => {
          throw new Error(error.error);
        })
      );
  }

  updateRoute(routeId: string, pathName: string, shared: boolean): Observable<any> {
    const payload = { pathName, shared };

    return this.http.put(this.URL + '/paths/' + routeId, payload);
  }
  

}
