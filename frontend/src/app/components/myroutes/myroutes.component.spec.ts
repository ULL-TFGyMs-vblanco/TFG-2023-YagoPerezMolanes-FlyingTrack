import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyroutesComponent } from './myroutes.component';
import { Router } from '@angular/router';
import { RoutesService } from 'src/app/services/routes.service';
import { of, throwError } from 'rxjs';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';

describe('MyroutesComponent', () => {
  let component: MyroutesComponent;
  let fixture: ComponentFixture<MyroutesComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routesServiceSpy: jasmine.SpyObj<RoutesService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const routesServiceSpyObj = jasmine.createSpyObj('RoutesService', ['searchRoutes', 'deleteRoute']);

    await TestBed.configureTestingModule({
      declarations: [MyroutesComponent],
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
    fixture = TestBed.createComponent(MyroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the map', () => {
    expect(component['map']).toBeDefined();
  });

  it('should call searchRoutes() and update routes', () => {
    const routesResponse: jasmine.Expected<jasmine.ArrayLike<any>> = [/* mocked routes data */];
    routesServiceSpy.searchRoutes.and.returnValue(of(routesResponse));

    component.searchRoutes();

    expect(routesServiceSpy.searchRoutes).toHaveBeenCalledWith(
      component.pathName,
      component.userId,
      component.duration,
      component.routeStartDay,
      component.routeStartMonth,
      component.routeStartYear
    );
    expect(component.routes).toEqual(routesResponse);
  });

  it('should draw a route on the map', () => {
    const route = { /* mocked route data */ };
    component['map'] = { /* mocked map object */ };

    component.drawRouteOnMap(route);

    // Add your assertions here to verify that the markers and polyline are added to the map correctly
  });

  it('should clear routes', () => {
    const mockedMap = {
      eachLayer: jasmine.createSpy('eachLayer')
        .and.callFake(callback => {
          callback({ instanceof: (layerType: any) => layerType === L.Marker || layerType === L.Polyline });
        }),
      removeLayer: jasmine.createSpy('removeLayer')
    };
    component['map'] = mockedMap;

    component.clearRoutes();

    expect(component.routes).toEqual([]);
    expect(mockedMap.eachLayer).toHaveBeenCalled();
    expect(mockedMap.removeLayer).toHaveBeenCalled();
  });

  it('should call deleteRoute() and perform additional actions after successful deletion', () => {
    const routeId = 'routeId';
    const deleteResponse = 'delete response';
    routesServiceSpy.deleteRoute.and.returnValue(of(deleteResponse));

    component.deleteRoute(routeId);

    expect(routesServiceSpy.deleteRoute).toHaveBeenCalledWith(routeId);
    expect(console.log).toHaveBeenCalledWith('Route deleted successfully:', deleteResponse);
    // Add your assertions here to verify that the additional actions, such as showing an alert and performing a new search, are performed
  });

  it('should handle error and perform additional actions after deletion failure', () => {
    const routeId = 'routeId';
    const deleteError = { message: 'delete error' };
    routesServiceSpy.deleteRoute.and.returnValue(throwError(deleteError));

    component.deleteRoute(routeId);

    expect(routesServiceSpy.deleteRoute).toHaveBeenCalledWith(routeId);
    expect(console.log).toHaveBeenCalledWith('Error deleting route:', deleteError);
    // Add your assertions here to verify that the additional actions, such as showing an alert and performing a new search, are performed
  });

  it('should navigate to the modifyroutes page with route data', () => {
    const routeId = 'routeId';
    const pathName = 'pathName';
    const shared = true;

    component.modifyRoute(routeId, pathName, shared);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/modifyroutes'], {
      state: { routeId: routeId, pathName: pathName, shared: shared }
    });
  });
});

