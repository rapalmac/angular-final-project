import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { importAppHeaderComponents } from './shared/util/material.importer';
import { CartService, UserService } from './service/app.services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, importAppHeaderComponents(), HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);
  cartCount:number | undefined;

  constructor(private cartService:CartService) {

  }

  ngOnInit(): void {
    this.cartService.onCourseCartChanged.subscribe(cart => {
      if (cart) {
        this.cartCount = cart.length;
      }
    });
  }

  isAuthenticated() {
    return this.userService.isAuthenticated();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
