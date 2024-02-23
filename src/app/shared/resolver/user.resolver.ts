import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";
import { UserDetails, UserService } from "../../service/app.services";

export const userDetailsResolver: ResolveFn<UserDetails> = (
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