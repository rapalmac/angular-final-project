import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { User } from "../../model/model";
import { inject } from "@angular/core";
import { UserService } from "../../service/app.services";
import { of } from "rxjs";

export const userResolver: ResolveFn<User> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    let userService = inject(UserService);
    let auth = userService.getAuthDetails();

    if (auth) {
        return userService.loadUserDetails();
    }

    return of();
  };