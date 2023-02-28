import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker'; // notificaciones de actulizacion, comprobaciones de actualizacion, del service worker
import { Platform } from '@angular/cdk/platform'; // conjunto de primitivas de comportamiento para crear componentes de interfaz de usuario
import { filter, map } from 'rxjs/operators'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'flying-track-ft';

  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined; // tipo de plataforma, ios, android

  constructor(private platform: Platform, private swUpdate: SwUpdate) {
    this.isOnline = false;
    this.modalVersion = false;
  }

  // metodo de inicio, comprueba la conectividad del navegador 
  public ngOnInit(): void {
    this.updateOnlineStatus();

    // anade un evento de escucha
    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        }),
      );
    }
    // carga el modal
    this.loadModalPwa();
  }

  // comprueba si el navegador esta online o no
  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  // actualizar la version de la aplicacion
  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  // cerrar la version de la aplicacion
  public closeVersion(): void {
    this.modalVersion = false;
  }

  // averigua cual es la plataforma y el navegador
  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  // muestra como se tiene que anadir en pantalla
  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }




}
