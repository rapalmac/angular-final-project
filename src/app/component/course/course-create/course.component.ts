import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { importMatComponents } from '../../../shared/util/material.importer';
import { Course } from '../../../model/model';
import { CourseService } from '../../../service/app.services';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from '../../../shared/dialog/alert-dialog/alert-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, importMatComponents()],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  fg:FormGroup;
  pictureName!:string;

  constructor(
    private service:CourseService, 
    private dialogRef:MatDialog,
    private router:Router,
    fb:FormBuilder
  ) {
    this.fg = fb.group({
      name: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: "blur"
      }],
      category: ["", {
        nonNullable: true,
        validators: [Validators.required],
        updateOn: "blur"
      }],
      picture: ["", {
        nonNullable: true,
        updateOn: "blur"
      }],
      price: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
        updateOn: "blur"
      }]
    })
  }

  onFileSelected(event:any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]
      let  reader = new FileReader();

      reader.onload = (event: any) => {
          this.pictureName = file.name;
          this.fg.get("picture")?.setValue(event.target.result)
      }
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    let data:Course = {
      ...this.fg.value
    }

    this.service.add(data).subscribe(() => {
      this.dialogRef.open(AlertDialog, {
        data: {
          title: "Saved successfully.",
          message: "The course was registered correctly."
        }
      }).afterClosed().subscribe(() => {
        this.router.navigate(["/home"]);
      });
    });
  }

  onReset() {
    this.pictureName = "";
    Object.keys(this.fg.controls).forEach(key => {
      this.fg.get(key)?.updateValueAndValidity();
    });
    document.querySelector("input")?.focus();
  }
} 
