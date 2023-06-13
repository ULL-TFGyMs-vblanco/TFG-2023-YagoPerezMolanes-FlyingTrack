import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['signUp']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should sign up successfully and navigate to "/tracking"', () => {
    authServiceSpy.signUp.and.returnValue(of({}));

    component.user.email = 'test@example.com';
    component.user.name = 'test';
    component.user.password = 'password';

    component.signUp();

    expect(authServiceSpy.signUp).toHaveBeenCalledWith(component.user);
    expect(SignupComponent.userName).toBe(component.user.name);
    // expect(SigninComponent.userName).toBe(component.user.name);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tracking']);
  });

  it('should display an error alert when sign up fails', () => {
    const errorMessage = 'Invalid credentials';
    authServiceSpy.signUp.and.returnValue(throwError({ error: errorMessage }));

    spyOn(window, 'alert');

    component.user.email = 'test@example.com';
    component.user.name = 'test';
    component.user.password = 'password';

    component.signUp();

    expect(authServiceSpy.signUp).toHaveBeenCalledWith(component.user);
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
    expect(component.clearInputFields).toHaveBeenCalled();
  });
});
