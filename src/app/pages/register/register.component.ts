import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private snackbar: MatSnackBar) {
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      retypePassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  register() {
    if (this.signUpForm.value.password != this.signUpForm.value.retypePassword) {
      this.snackbar.open('Passwords should match. Please type matching passwords and try again.', 'Close', {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 3000
      });
      return;
    }
    if (this.signUpForm.valid) {
      this.userService.register(this.signUpForm.value).subscribe(result => {
        console.log(result);
        this.snackbar.open('Registration was successful. Please go ahead and login.', 'Close', {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 3000
        });
      }, err => {
        console.log(err);
        this.snackbar.open('Registration failed. Please contact support.', 'Close', {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 3000
        });
      });
    }
  }

}
