import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
  });

  it('should make a POST request to signUp endpoint',
    inject([AuthService, HttpTestingController], (service: AuthService, httpMock: HttpTestingController) => {
      const user = { username: 'testuser', password: 'testpassword' };

      service.signUp(user).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('https://trick-tracking-app-backend.herokuapp.com/signUp');
      expect(req.request.method).toBe('POST');
      req.flush({}); // Mock response

      httpMock.verify();
    })
  );

  it('should make a POST request to signIn endpoint',
    inject([AuthService, HttpTestingController], (service: AuthService, httpMock: HttpTestingController) => {
      const user = { username: 'testuser', password: 'testpassword' };

      service.signIn(user).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('https://trick-tracking-app-backend.herokuapp.com/signIn');
      expect(req.request.method).toBe('POST');
      req.flush({}); // Mock response

      httpMock.verify();
    })
  );
});

