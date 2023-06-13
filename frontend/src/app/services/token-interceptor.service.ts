import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor() {
    console.log("Token Interceptor Service works");
  }
}
