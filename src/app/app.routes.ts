import { Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';
import { SignupComponent } from './component/auth/signup/signup.component';
import { AuthorComponent } from './component/author/author.component';
import { GenreComponent } from './component/genre/genre.component';
import { HomeComponent } from './component/home/home.component';
import { UserDetailsComponent } from './component/user/user-details/user-details.component';
import { UserEditComponent } from './component/user/user-edit/user-edit.component';
import { UserHomeComponent } from './component/user/user-home/user-home.component';
import { authGuard } from './shared/util/route.guards';
import { userResolver } from './shared/resolver/user.resolver';

export const routes: Routes = [    
    { path: "login", component: LoginComponent }, 
    { path: "signup", component: SignupComponent }, 
    { path: "user", component: UserHomeComponent, canActivate: [authGuard], resolve: {user: userResolver}, children: [
        { path: "details", resolve: {user: userResolver}, component: UserDetailsComponent },
        { path: "edit", resolve: {user: userResolver}, component: UserEditComponent },
        { path: "", redirectTo: "/user/details", pathMatch: "full"}
    ]}, 
    { path: "home",   component: HomeComponent, canActivate: [authGuard] },
    { path: "authors",   component: AuthorComponent, canActivate: [authGuard] },
    { path: "genres",   component: GenreComponent, canActivate: [authGuard]},
    { path: "", redirectTo: "/home", pathMatch: "full" }, 
    { path: "**", redirectTo: "/" }, 
];
