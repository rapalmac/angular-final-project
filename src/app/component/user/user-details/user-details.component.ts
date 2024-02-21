import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { importMatComponents } from '../../../shared/util/material.importer';
import { UserService } from '../../../service/app.services';
import { CommonModule } from '@angular/common';
import { User } from '../../../model/model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterLink, importMatComponents()],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  userDetails!:User;

  constructor(route:ActivatedRoute) {
    route.data.subscribe(data => {
      this.userDetails = data["user"];
    });
  }

}
