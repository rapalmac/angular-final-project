import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, NgZone, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

export class AppErrorHandler implements ErrorHandler {
    snackBar = inject(MatSnackBar);
    zone = inject(NgZone)

    handleError(error: any): void {
        this.zone.run(() => {
            this.snackBar.open(error.message ?? "Unknown error has occurred.", "Ok");
            console.log(error);
        });
    }
}