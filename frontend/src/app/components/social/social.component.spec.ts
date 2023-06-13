import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialComponent } from './social.component';
import { RoutesService } from 'src/app/services/routes.service';
import { of } from 'rxjs';
import * as L from 'leaflet';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;
  let routesServiceSpy: jasmine.SpyObj<RoutesService>;

  beforeEach(() => {
    const routesServiceMock = jasmine.createSpyObj('RoutesService', ['getSharedRoutes']);

    TestBed.configureTestingModule({
      declarations: [SocialComponent],
      providers: [{ provide: RoutesService, useValue: routesServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;
    routesServiceSpy = TestBed.inject(RoutesService) as jasmine.SpyObj<RoutesService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch shared routes on component initialization', () => {
    const sharedRoutes = [{ id: 1, name: 'Route 1' }, { id: 2, name: 'Route 2' }];
    routesServiceSpy.getSharedRoutes.and.returnValue(of(sharedRoutes));

    component.ngOnInit();

    expect(routesServiceSpy.getSharedRoutes).toHaveBeenCalled();
    expect(component.sharedRoutes).toEqual(sharedRoutes);
  });

  it('should select a route and show it on the map', () => {
    const route = { id: 1, name: 'Route 1', path: [{ latitude: 10, longitude: 20 }, { latitude: 30, longitude: 40 }] };

    spyOn(window, 'setTimeout');

    component.selectRoute(route);

    expect(component.selectedRoute).toEqual(route);
    expect(component.showMap).toBeTrue();
    expect(component.showCards).toBeFalse();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  it('should show the route on the map', () => {
    const route = { id: 1, name: 'Route 1', path: [{ latitude: 10, longitude: 20 }, { latitude: 30, longitude: 40 }] };

    const leafletMapSpy = jasmine.createSpyObj('L.Map', ['setView']);
    const tileLayerSpy = jasmine.createSpyObj('L.TileLayer', ['addTo']);
    const markerSpy = jasmine.createSpyObj('L.Marker', ['addTo']);
    const polylineSpy = jasmine.createSpyObj('L.Polyline', ['addTo']);

    spyOn(L, 'map').and.returnValue(leafletMapSpy);
    spyOn(L, 'tileLayer').and.returnValue(tileLayerSpy);
    spyOn(L, 'marker').and.returnValue(markerSpy);
    spyOn(L, 'polyline').and.returnValue(polylineSpy);

    component.selectedRoute = route;
    component.showRouteOnMap();

    expect(L.map).toHaveBeenCalledWith('map');
    expect(leafletMapSpy.setView).toHaveBeenCalledWith([route.path[0].latitude, route.path[0].longitude], 13);
    expect(L.tileLayer).toHaveBeenCalledWith('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });
    expect(tileLayerSpy.addTo).toHaveBeenCalledWith(leafletMapSpy);
    expect(L.marker).toHaveBeenCalledWith([route.path[0].latitude, route.path[0].longitude], {
      icon: component.startGeolocationIcon
    });
    expect(markerSpy.addTo).toHaveBeenCalledWith(leafletMapSpy);
    expect(L.polyline).toHaveBeenCalledWith([[route.path[0].latitude, route.path[0].longitude], [route.path[1].latitude, route.path[1].longitude]]);
    expect(polylineSpy.addTo).toHaveBeenCalledWith(leafletMapSpy);
    expect(L.marker).toHaveBeenCalledWith([route.path[1].latitude, route.path[1].longitude], {
      icon: component.finalGeolocationIcon
    });
    expect(markerSpy.addTo).toHaveBeenCalledWith(leafletMapSpy);
  });

  it('should return to show cards view', () => {
    component.returnShowCards();

    expect(component.showMap).toBeFalse();
    expect(component.showCards).toBeTrue();
  });
});
