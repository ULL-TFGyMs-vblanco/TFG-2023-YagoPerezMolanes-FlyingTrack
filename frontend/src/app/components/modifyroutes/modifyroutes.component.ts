import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-modifyroutes',
  templateUrl: './modifyroutes.component.html',
  styleUrls: ['./modifyroutes.component.css']
})
export class ModifyroutesComponent {

  routeId!: string; //se que esta asignado antes de su uso
  pathName!: string;
  shared!: boolean;

  updateRoute() {
    // Aquí puedes implementar la lógica de actualización de la ruta en el servidor
    // Utiliza los valores de this.routeId, this.pathName y this.share
  
    // Ejemplo de llamada a una función de servicio para actualizar la ruta en el servidor
    this.routesService.updateRoute(this.routeId, this.pathName, this.shared).subscribe(
      (response) => {
        // Manejar la respuesta del servidor después de la actualización exitosa
        console.log('Ruta actualizada:', response);
        alert(`Ruta actualizada: ${response}`);
  
        // Navegar a una ruta diferente después de la actualización exitosa, si es necesario
        this.router.navigate(['myroutes']);
      },
      (error) => {
        // Manejar el error en caso de que la actualización falle
        console.error('Error al actualizar la ruta:', error);

        this.router.navigate(['myroutes']);
      }
    );
  }
  

  constructor(private router: Router, private routesService: RoutesService) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras.state) {
      const currentState = currentNavigation.extras.state;
      this.routeId = currentState['routeId'];
      this.pathName = currentState['pathName'];
      this.shared = currentState['shared'];
    }
    console.log(this.routeId, this.pathName, this.shared);
  }

}
