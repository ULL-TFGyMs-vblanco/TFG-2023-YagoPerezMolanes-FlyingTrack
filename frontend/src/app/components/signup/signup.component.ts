import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SigninComponent } from '../signin/signin.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  user = {
    email: '',
    name: '',
    password: ''
  };

  static userName = '';

  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('nameInput') nameInput!: ElementRef;


  signUp(): void {
    if (SignupComponent.userName != '') {
      alert(`El usuario ${SignupComponent.userName} ya ha iniciado sesión`);
      this.router.navigate(['/tracking']);
    } else {
      this.authService.signUp(this.user).subscribe(
        res => {
          SignupComponent.userName = this.user.name;
          SigninComponent.userName = this.user.name;
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
    this.emailInput.nativeElement.value = '';
    this.nameInput.nativeElement.value = '';
  }

  ngOnInit() {
    console.log("SignUp component works");
  }


  constructor(private authService: AuthService, private router: Router) {
  }
}
