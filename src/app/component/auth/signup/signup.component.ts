import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { importMatComponents } from '../../../shared/util/material.importer';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { UserService } from '../../../service/app.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog as AlertDialog } from '../../../shared/dialog/alert-dialog/alert-dialog';
import { Router, RouterLink } from '@angular/router';
import { passwordValidator } from '../../../shared/validator/validators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, importMatComponents(), CdkTextareaAutosize, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  fg:FormGroup;
  availableInterests:string[] = ["Workout", "Music", "Books", "Gadgets", "Movies", "Sports"];

  constructor(
    private fb:FormBuilder, 
    private service:UserService, 
    private snackBar:MatSnackBar,
    private dialogRef:MatDialog,
    private router:Router
  ){
    this.fg = this.fb.group({
      email: ["", {
        validators: [Validators.required, Validators.minLength(4), Validators.email]
      }],
      displayName: ["", {
        validators: [Validators.required, Validators.minLength(4)]
      }],
      firstName: ["", {
        validators: [Validators.required, Validators.minLength(4)]
      }],
      lastName: ["", {
        validators: [Validators.required, Validators.minLength(4)]
      }],
      password: ["", {
        validators: [Validators.required, Validators.minLength(8), passwordValidator]
      }],
      userType: ["", {
        validators: []
      }]
    });
  }

  ngOnInit(): void {
    this.fg.get("userType")?.setValue("student");
  }

  resetForm() {
    this.fg.reset();
    Object.keys(this.fg.controls).forEach(key => {
      this.fg.get(key)?.setErrors(null) ;
    });
    document.getElementById("email")?.focus();
  }

  onSubmit() {
    this.service.add(this.fg.value).subscribe(() => {
      this.dialogRef.open(AlertDialog, {
        data: {
          title: "Signup successfully.",
          message: "The user was registered correctly, you will get redirected to the login page."
        }
      }).afterClosed().subscribe(() => {
        this.router.navigate(["/login"]);
      });
      this.resetForm();
    });
  }
}
