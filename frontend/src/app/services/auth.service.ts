import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL: string = 'https://trick-tracking-app-backend.herokuapp.com';
  // private URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  signUp(user: any) {
    return this.http.post<any>(this.URL + '/signUp', user);
  }

  signIn(user: any) {
    return this.http.post<any>(this.URL + '/signIn', user);
  }
}
