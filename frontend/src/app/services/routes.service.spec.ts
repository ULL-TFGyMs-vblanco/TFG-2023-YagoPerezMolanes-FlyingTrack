import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RoutesService } from './routes.service';

describe('RoutesService', () => {
  let routesService: RoutesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoutesService]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should make a POST request to saveRoute endpoint',
    inject([RoutesService, HttpTestingController], (service: RoutesService, httpMock: HttpTestingController) => {
      const path = { /* path data */ };

      service.saveRoute(path).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('https://trick-tracking-app-backend.herokuapp.com/paths');
      expect(req.request.method).toBe('POST');
      req.flush({}); // Mock response
    })
  );

  it('should make a GET request to searchRoutes endpoint',
    inject([RoutesService, HttpTestingController], (service: RoutesService, httpMock: HttpTestingController) => {
      const pathName = 'test';
      const userId = '123';
      const duration = 100;
      const routeStartDay = 1;
      const routeStartMonth = 1;
      const routeStartYear = 2022;

      service.searchRoutes(pathName, userId, duration, routeStartDay, routeStartMonth, routeStartYear).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('https://trick-tracking-app-backend.herokuapp.com/myPaths?pathName=test&userId=123&duration=100&routeStartDay=1&routeStartMonth=1&routeStartYear=2022');
      expect(req.request.method).toBe('GET');
      req.flush([]); // Mock response
    })
  );

  it('should make a GET request to getSharedRoutes endpoint',
    inject([RoutesService, HttpTestingController], (service: RoutesService, httpMock: HttpTestingController) => {
      service.getSharedRoutes().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('https://trick-tracking-app-backend.herokuapp.com/social');
      expect(req.request.method).toBe('GET');
      req.flush({}); // Mock response
    })
  );

  it('should make a DELETE request to deleteRoute endpoint',
    inject([RoutesService, HttpTestingController], (service: RoutesService, httpMock: HttpTestingController) => {
      const routeId = '123';

      service.deleteRoute(routeId).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('https://trick-tracking-app-backend.herokuapp.com/paths/123');
      expect(req.request.method).toBe('DELETE');
      req.flush({}); // Mock response
    })
  );

  it('should make a PUT request to updateRoute endpoint',
    inject([RoutesService, HttpTestingController], (service: RoutesService, httpMock: HttpTestingController) => {
      const routeId = '123';
      const pathName = 'new name';
      const shared = true;

      service.updateRoute(routeId, pathName, shared).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('https://trick-tracking-app-backend.herokuapp.com/paths/123');
      expect(req.request.method).toBe('PUT');
      req.flush({}); // Mock response
    })
  );
});
