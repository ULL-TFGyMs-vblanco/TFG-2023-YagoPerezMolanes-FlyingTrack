import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'flying-track-ft';

  isOnline: boolean;

  constructor() {
    this.isOnline = false;
  }

  // metodo de inicio, comprueba la conectividad del navegador 
  public ngOnInit(): void {
    this.updateOnlineStatus();

    // anade un evento de escucha
    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }


}
