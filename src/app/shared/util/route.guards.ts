import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../../service/app.services";

export const authGuard:CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let auth = inject(UserService).isAuthenticated();

    if (!auth) {
        inject(Router).navigate(["/login"]);
        console.log("redirecting");
        return false;
    }    

    return true;
}
