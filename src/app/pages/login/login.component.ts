import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private snackbar: MatSnackBar, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.valid) {
      this.userService.authenticate(this.loginForm.value).subscribe(result => {
        console.log(result);
        localStorage.setItem('authToken', result.data.authToken);
        this.router.navigateByUrl('/home');
      }, err => {
        console.log(err);
        this.snackbar.open('Authentication failed. Username/Password incorrect.', 'Close', {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 3000
        });
      });
    }
  }

}
