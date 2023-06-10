import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{

  user = {
    email: '',
    name: '',
    password: ''
  };

  static userName = '';

  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  signIn(): void {
    if (SigninComponent.userName != '') {
      alert(`El usuario ${SigninComponent.userName} ya ha iniciado sesión`);
      this.router.navigate(['/tracking']);
    } else {
      this.authService.signIn(this.user).subscribe(
        res => {
          SigninComponent.userName = this.user.name;
          SignupComponent.userName = this.user.name;
          console.log(res);
          this.router.navigate(['/tracking']);
        },
        err => {
          console.log(err);
          alert(err.error);
          this.clearInputFields();
          
        }
      )
    }

  }

  clearInputFields(): void {
    this.passwordInput.nativeElement.value = '';
    this.nameInput.nativeElement.value = '';
  }

  ngOnInit() {
  }

  constructor(private authService: AuthService, private router: Router) {
  }
}
