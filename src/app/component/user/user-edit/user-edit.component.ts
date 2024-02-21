import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../model/model';
import { UserService } from '../../../service/app.services';
import { importMatComponents } from '../../../shared/util/material.importer';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, importMatComponents(), CdkTextareaAutosize],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit{
  userDetails!:User;
  fg:FormGroup;
  availableInterests = ["Workout", "Music", "Movies", "Books", "Camping", "Series", "Cycling", "Sports"];

  constructor(
    private userService:UserService, 
    private router:Router, 
    fb:FormBuilder, 
    route:ActivatedRoute
  ) {
    route.data.subscribe(data => {
      this.userDetails = data["user"];
    });

    this.fg = fb.group({
      displayName: ["", {
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: "blur"
      }],
      firstName: ["", {
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: "blur"
      }],
      lastName: ["", {
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: "blur"
      }],
      userType: ["", {
        validators: [Validators.required]
      }],
      bio: ["", {
        validators: [Validators.minLength(20)],
        updateOn: "blur"
      }],
      interests: ["", {

      }],
      experience: ["", {
        updateOn: "blur"
      }],
      role: ["", {
        updateOn: "blur"
      }],
      domainExpertise: ["", {
        updateOn: "blur"
      }]
    })
  }

  ngOnInit(): void {
    if (this.userDetails) {
      Object.keys(this.fg.controls).forEach(key => {
        let _val = this.userDetails[key as keyof User];
        this.fg.controls[key].setValue(_val);
      });

      this.onSelectUserType();
    }
  }

  onFormSubmit() {
    this.userService.update(this.userDetails.id, {
      ...this.userDetails,
      ...this.fg.value
    }).subscribe(() =>{
      this.userService.loadUserDetails(true).subscribe(() => {
        this.router.navigate(["/user"]);
      });
    });    
  }

  onSelectUserType() {
    let _val = this.fg.get("userType")?.value;
    switch(_val) {
      case "student":
        this.fg.get("experience")?.clearValidators();
        this.fg.get("experience")?.updateValueAndValidity();
        this.fg.get("domainExpertise")?.clearValidators();
        this.fg.get("domainExpertise")?.updateValueAndValidity();
        this.fg.get("role")?.clearValidators();
        this.fg.get("role")?.updateValueAndValidity();
        break;
      case "professional":
        this.fg.get("experience")?.addValidators([Validators.required]);
        this.fg.get("experience")?.updateValueAndValidity();
        this.fg.get("domainExpertise")?.addValidators([Validators.required]);
        this.fg.get("domainExpertise")?.updateValueAndValidity();
        this.fg.get("role")?.addValidators([Validators.required]);
        this.fg.get("role")?.updateValueAndValidity();
        break;
      default:
        //nothing
    }
  }
}
