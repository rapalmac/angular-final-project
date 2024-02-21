import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { User } from '../../../model/model';
import { UserService } from '../../../service/app.services';
import { importMatComponents } from '../../../shared/util/material.importer';


@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, importMatComponents()],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  userDetails!:User;
  localUrl!:any[] | null;

  constructor(
    private userService:UserService,
    private router:Router,
    activatedRoute: ActivatedRoute
  ) {
    activatedRoute.data.subscribe((data) => {
      this.userDetails = data["user"] as User;
    });
  }

  ngOnInit(): void {
    this.userService.onLoadUserDetailsCompleted.subscribe(data => {
      this.userDetails = data;
    })
  }

  onFileSelected(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        console.log("Completed", this.localUrl);
          this.localUrl = event.target.result;
          this.userService.update(this.userDetails.id, {
            ...this.userDetails,
            picture: this.localUrl?.toString()
          }).subscribe(() => {
            this.userService.resetUserDetails();
            this.router.navigate(["/user"]);
          })
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
