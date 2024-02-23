import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { importMatComponents } from '../../../shared/util/material.importer';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Course, User } from '../../../model/model';
import { CartService, CourseService, UserDetails } from '../../../service/app.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, importMatComponents()],
  templateUrl: './home.page.component.html',
  styleUrl: './home.page.component.css'
})
export class HomePageComponent implements OnInit {
  userDetails!:UserDetails;
  userCourses!: Course[];
  userOrders!: import("/home/rpalma/ws/angular/angular-final-project/src/app/model/model").Order[];
  
  constructor(
    private courseService:CourseService,
    private cartService:CartService,
    activatedRoute: ActivatedRoute
    ) {
      activatedRoute.data.subscribe((data) => {
        this.userDetails = data["user"] as UserDetails;
      });
  }

  ngOnInit(): void {
    if (this.userDetails.user.courses) {
      this.courseService.listAll().subscribe(data => {
        this.userCourses = data.filter(c => {
          let _courses = this.userDetails.user.courses ?? [];
          return _courses.includes(c.id)
        })
      });
    }

    //Retrieve user orders
    this.cartService.listAll().subscribe(data => {
      this.userOrders = data.filter(o => o.userId = this.userDetails.user.id);
    })
  }

  calcCourseRating(course:Course) {
    if (course.rating && course.rating.length > 0) {
      return course.rating.reduce((sum, c) => sum += c.rate, 0) / course.rating.length;
    }

    return 0;
  }
}
