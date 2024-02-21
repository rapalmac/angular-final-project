import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../../service/app.services";

export const authGuard:CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let auth = inject(UserService).isAuthenticated();
    console.log(auth);

    if (!auth) {
        inject(Router).navigate(["/login"]);
        console.log("redirecting");
        return false;
    }    

    return true;
}
