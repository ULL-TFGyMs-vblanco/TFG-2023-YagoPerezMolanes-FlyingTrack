import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// importamos los componentes para las rutas
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { TrackingComponent } from './components/tracking/tracking.component'; 
import { MyroutesComponent } from './components/myroutes/myroutes.component';
import { HomeComponent } from './components/home/home.component';
import { SocialComponent } from './components/social/social.component';

// cada vez que se visite una ruta cada uno de los componentes anteriores sera
// renderizado, el que se renderizara por defecto sera la ruta /home, la ruta inicial
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'tracking',
    component: TrackingComponent
  },
  {
    path: 'myroutes',
    component: MyroutesComponent
  },
  {
    path: 'social',
    component: SocialComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
