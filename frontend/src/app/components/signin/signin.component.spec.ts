import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['signIn']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [SigninComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should sign in successfully and navigate to "/tracking"', () => {
    authServiceSpy.signIn.and.returnValue(of({}));

    component.user.email = 'test@example.com';
    component.user.name = 'test';
    component.user.password = 'password';

    component.signIn();

    expect(authServiceSpy.signIn).toHaveBeenCalledWith(component.user);
    expect(SigninComponent.userName).toBe(component.user.name);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tracking']);
  });

  it('should display an error alert when sign in fails', () => {
    const errorMessage = 'Invalid credentials';
    authServiceSpy.signIn.and.returnValue(throwError({ error: errorMessage }));

    spyOn(window, 'alert');

    component.user.email = 'test@example.com';
    component.user.name = 'test';
    component.user.password = 'password';

    component.signIn();

    expect(authServiceSpy.signIn).toHaveBeenCalledWith(component.user);
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
    expect(component.clearInputFields).toHaveBeenCalled();
  });
});
