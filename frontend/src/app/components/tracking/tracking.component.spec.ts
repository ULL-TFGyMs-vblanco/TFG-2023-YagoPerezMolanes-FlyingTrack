import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observer } from 'rxjs';

import { TrackingComponent } from './tracking.component';
import { RoutesService } from 'src/app/services/routes.service';
import { FormsModule } from '@angular/forms';

describe('TrackingComponent', () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;
  let routesServiceSpy: jasmine.SpyObj<RoutesService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RoutesService', ['saveRoute']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [TrackingComponent],
      providers: [{ provide: RoutesService, useValue: spy }],
    }).compileComponents();

    routesServiceSpy = TestBed.inject(RoutesService) as jasmine.SpyObj<RoutesService>;
    routesServiceSpy.saveRoute.and.returnValue(of({}));

    fixture = TestBed.createComponent(TrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track position and update path', () => {
    const position: GeolocationPosition = {
      coords: {
        latitude: 0,
        longitude: 0,
        altitude: null,
        heading: null,
        speed: null,
        accuracy: 0,
        altitudeAccuracy: 0
      },
      timestamp: 1234567890 // Coloca aquí un valor de timestamp válido
    };
    const geolocation = navigator.geolocation as jasmine.SpyObj<Geolocation>;

    geolocation.watchPosition.and.callFake((successCallback: PositionCallback) => {
      successCallback(position);
      return 1;
    });

    component.trackPosition();

    expect(geolocation.watchPosition).toHaveBeenCalled();
    expect(component.path.path.length).toBe(1);
    expect(component.actualLtd).toBe(position.coords.latitude);
    expect(component.actualLng).toBe(position.coords.longitude);
    expect(component.actualAlt).toBe(0);
    expect(component.actualHead).toBe(0);
    expect(component.actualSpeed).toBe(0);
  });

  it('should end position and call saveRoute', () => {
    const observer: Observer<any> = {
      next: jasmine.createSpy('next'),
      error: jasmine.createSpy('error'),
      complete: jasmine.createSpy('complete')
    };

    component.path.path.push({ latitude: 0, longitude: 0 });
    component.pathName = 'Test Path';
    component.shareRoute = false;

    component.endPosition();

    expect(routesServiceSpy.saveRoute).toHaveBeenCalledWith(component.path);
    expect(observer.next).toHaveBeenCalled();
    expect(observer.error).not.toHaveBeenCalled();
    expect(observer.complete).not.toHaveBeenCalled();
  });
});
