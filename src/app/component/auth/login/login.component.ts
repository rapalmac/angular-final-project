import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../service/app.services';
import { importMatComponents } from '../../../shared/util/material.importer';
import { passwordValidator } from '../../../shared/validator/validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, importMatComponents()],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  formGroup:any;
userService = inject(UserService);
  router = inject(Router);  
  snackBar = inject(MatSnackBar);
  subcription!:Subscription;
  
  constructor(fb:FormBuilder) {
    this.formGroup = fb.group({
      email: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6), Validators.email],
        updateOn: "blur"
      }],
      password: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6), passwordValidator]
      }]
    });
  }

  ngOnInit(): void {
    this.subcription = this.userService.onAuthenticationCompleted.subscribe((auth) => {
      if (auth.status == "success") {
        this.router.navigate(["books"]);
      } else if (auth.error) {
        this.snackBar.open(auth.error + "", "Ok");
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  onLogin() {
    try {
      this.userService.authenticate(this.formGroup.value);
    } catch(error) {
      alert(error);
    }
  }
}
