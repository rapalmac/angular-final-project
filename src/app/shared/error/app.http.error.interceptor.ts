import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";

export class AppHttpErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error:HttpErrorResponse) => {
                let _message = `Http error has ocurred, please reach out your system administrator [Http Status: ${error.status ?? "UNKNOWN"}].`
                console.log(_message, error);
                
                return throwError(() => new Error(_message));
            })
        )
    }

}