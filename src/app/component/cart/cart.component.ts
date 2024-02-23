import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course, User } from '../../model/model';
import { CartService, UserDetails, UserService } from '../../service/app.services';
import { AlertDialog } from '../../shared/dialog/alert-dialog/alert-dialog';
import { ConfirmDialog } from '../../shared/dialog/confirm-dialog/confirm-dialog';
import { importMatComponents } from '../../shared/util/material.importer';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, importMatComponents()],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartList!:Course[];
  subc!: Subscription;
  userDetails!:UserDetails;

  constructor(
    private cartService:CartService,
    private userService:UserService,
    private router:Router,
    private dialogRef:MatDialog,
    activatedRoute:ActivatedRoute) {
      activatedRoute.data.subscribe((data) => {
        this.userDetails = data["user"] as UserDetails;
      });
  }  

  ngOnInit(): void {
    this.cartList = this.cartService.cart
    this.subc = this.cartService.onCourseCartChanged.subscribe(cart => {
      this.cartList = cart;
    })
  }

  ngOnDestroy(): void {
    if (this.subc) {
      this.subc.unsubscribe();
    }
  }

  getTotal() {
    return [...this.cartList.values()].reduce((sum, o) => sum += o.price, 0);
  }

  onRemoveCourse(course: Course) {
    this.dialogRef.open(ConfirmDialog, {
      data: {
        title: "Confirmation",
        message: `Are you sure you want to remove the course ${course.name}?`
      }
    }).afterClosed().subscribe(() => {
      this.cartService.removeFromCart(course);
    })
  }

  onCheckout() {
    this.cartService.createOrder(this.userDetails.user).subscribe(() => {
        this.dialogRef.open(AlertDialog, {
          data: {
            title: "Order created",
            message: "Your order have been successfuly created."
          }
        }).afterClosed().subscribe(() => {
          this.userService.resetUserDetails();
          this.router.navigate(["/home"]);
        })
    });
  }
}
