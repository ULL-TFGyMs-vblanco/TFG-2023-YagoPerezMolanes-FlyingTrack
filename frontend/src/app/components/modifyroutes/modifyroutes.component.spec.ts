import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyroutesComponent } from './modifyroutes.component';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/services/routes.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ModifyroutesComponent', () => {
  let component: ModifyroutesComponent;
  let fixture: ComponentFixture<ModifyroutesComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routesServiceSpy: jasmine.SpyObj<RoutesService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['getCurrentNavigation', 'navigate']);
    const routesServiceSpyObj = jasmine.createSpyObj('RoutesService', ['updateRoute']);

    await TestBed.configureTestingModule({
      declarations: [ModifyroutesComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: RoutesService, useValue: routesServiceSpyObj }
      ],
      imports: [FormsModule],
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routesServiceSpy = TestBed.inject(RoutesService) as jasmine.SpyObj<RoutesService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties', () => {
    component.routeId = 'route123';
    component.pathName = 'path';
    component.shared = true;
    expect(component.routeId).toEqual('route123');
    expect(component.pathName).toEqual('path');
    expect(component.shared).toEqual(true);
  });

  it('should call updateRoute() and navigate after successful update', () => {
    const response = 'Route updated successfully';
    routesServiceSpy.updateRoute.and.returnValue(of(response));

    component.routeId = 'route123';
    component.pathName = 'newPath';
    component.shared = false;

    component.updateRoute();

    expect(routesServiceSpy.updateRoute).toHaveBeenCalledWith('route123', 'newPath', false);
    expect(console.log).toHaveBeenCalledWith('Ruta actualizada:', response);
    expect(alert).toHaveBeenCalledWith(`Ruta actualizada: ${response}`);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['myroutes']);
  });

  it('should handle error and navigate after update failure', () => {
    const error = 'Error updating route';
    routesServiceSpy.updateRoute.and.returnValue(throwError(error));

    component.updateRoute();

    expect(console.error).toHaveBeenCalledWith('Error al actualizar la ruta:', error);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['myroutes']);
  });
});
