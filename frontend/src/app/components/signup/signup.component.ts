import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'

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

  signUp() {
    this.authService.signUp(this.user).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/tracking']);
      },
      err => {
        console.log(err);
      }
    )
  }

  ngOnInit() {
  }


  constructor(private authService: AuthService, private router: Router) {
  }
}
