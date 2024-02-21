import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordValidator:ValidatorFn = (control:AbstractControl) : ValidationErrors | null => {
    const value = control.value;

    if (!value) {
        return null;
    }

    let hasUppers = /[A-Z]/.test(value);
    let hasLowers = /[a-z]/.test(value);
    let hasNumbers = /[0-9]/.test(value);

    return !(hasUppers && hasLowers && hasNumbers) ? {"password": true} : null;
}
