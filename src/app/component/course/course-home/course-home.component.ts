import { Component, OnInit } from '@angular/core';
import { CartService, CourseService, UserDetails } from '../../../service/app.services';
import { Course, User } from '../../../model/model';
import { CommonModule } from '@angular/common';
import { importMatComponents } from '../../../shared/util/material.importer';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from '../../../shared/dialog/alert-dialog/alert-dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-home',
  standalone: true,
  imports: [CommonModule, FormsModule, importMatComponents()],
  templateUrl: './course-home.component.html',
  styleUrl: './course-home.component.css'
})
export class CourseHomeComponent implements OnInit {
  availableCourses!: Course[];
  filterBy!:string;
  filteredList!: Course[] | undefined;
  filterString!:string;
  sortBy: any;
  userDetails!: UserDetails;

  constructor(
    private service:CourseService,
    private cartService:CartService,
    private dialogRef:MatDialog,
    activatedRoute:ActivatedRoute
  ) {
    activatedRoute.data.subscribe(data => {
      this.userDetails = data["user"] as UserDetails
    })
  }

  ngOnInit(): void {
    this.service.listAll().subscribe(data => {
      this.availableCourses = data;
    });

    this.filterBy = "name";
  }

  onSortCourses(event:any, prop:string, order:1 | -1) {  
    this.sortBy = event.target.innerText;    
    if (this.filteredList) {
      this.filteredList = this.sortCourses(this.filteredList, prop, order)
    } else {
      this.availableCourses = this.sortCourses(this.availableCourses, prop, order);
    }
  }

  sortCourses(list:Course[], prop:string, order:1 | -1):Course[] {
    return list.sort((a:Course, b:Course) => {
      let _prop = prop as keyof Course;
      let _val1 = a[_prop] ?? "";
      let _val2 = b[_prop] ?? "";

      if (_val1 === _val2) {
        return 0;
      }

      return (_val1 > _val2 ? 1 : -1) * order;
    });
  }

  onFilterByChange(event:any) {
    this.filterBy = event.value as keyof Course;
  }

  onFilterKeyup(event:any) {
    this.filterString = (event.target.value ?? "").toLowerCase();

    if (this.filteredList && this.filteredList.length > 0)
    this.filteredList = this.availableCourses.filter((course) => {
      let _prop = this.filterBy as keyof Course;
      let _val = (course[_prop] ?? "") as string;
      return _val.toLowerCase().indexOf(this.filterString) > -1;
    });
  }

  onClearFilters() {
    this.filterBy = "";
    this.sortBy = "";
    this.filteredList = undefined;
    this.filterString = "";
    document.querySelector("input")?.focus();
  }

  onAddToCart(selectedCourse: Course) {
    try {
      this.cartService.addToCard(selectedCourse);
    } catch (error:any) {
      this.dialogRef.open(AlertDialog, {
        data: {
          title: "Duplicated course",
          message: error.message
        }
      });
    }
  }

  isUserCourse(courseId:string) {
    return this.userDetails.user.courses?.includes(courseId);
  }
}