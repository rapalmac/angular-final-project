import { Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';
import { SignupComponent } from './component/auth/signup/signup.component';
import { CourseComponent } from './component/course/course-create/course.component';
import { CourseHomeComponent } from './component/course/course-home/course-home.component';
import { HomePageComponent } from './component/home/home-page/home.page.component';
import { UserDetailsComponent } from './component/user/user-details/user-details.component';
import { UserEditComponent } from './component/user/user-edit/user-edit.component';
import { UserHomeComponent } from './component/user/user-home/user-home.component';
import { userDetailsResolver } from './shared/resolver/user.resolver';
import { authGuard } from './shared/util/route.guards';
import { CartComponent } from './component/cart/cart.component';

export const routes: Routes = [    
    { path: "login", component: LoginComponent }, 
    { path: "signup", component: SignupComponent }, 
    { path: "user", component: UserHomeComponent, canActivate: [authGuard], resolve: {user: userDetailsResolver}, children: [
        { path: "details", resolve: {user: userDetailsResolver}, component: UserDetailsComponent },
        { path: "edit", resolve: {user: userDetailsResolver}, component: UserEditComponent },
        { path: "", redirectTo: "/user/details", pathMatch: "full"}
    ]}, 
    { path: "home", component: HomePageComponent, resolve: {user: userDetailsResolver}, canActivate: [authGuard]},
    { path: "courses",   component: CourseHomeComponent, resolve: {user: userDetailsResolver}, canActivate: [authGuard] },
    { path: "create-course",   component: CourseComponent, canActivate: [authGuard] },
    { path: "cart", component: CartComponent, resolve: {user: userDetailsResolver}, canActivate: [authGuard] },
    { path: "", redirectTo: "/home", pathMatch: "full" }, 
    { path: "**", redirectTo: "/" }, 
];
