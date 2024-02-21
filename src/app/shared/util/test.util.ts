import { FormGroup } from "@angular/forms";

export function isErrorPresent(form:FormGroup, controlName:string, validationError:string):boolean {
    let control = form.get(controlName);

    if (!control) {
        fail(`Control ${controlName} does not exists in this form.`);
    }

    if (!control?.errors) {
        return false;
    }

    return control.errors[validationError] != undefined;
}

export function setFormValue(form:FormGroup, value:any) {
    form.setValue(value);
    form.markAsTouched();
}