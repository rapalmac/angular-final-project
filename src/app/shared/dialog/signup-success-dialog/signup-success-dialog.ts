import { Component } from '@angular/core';
import { importMapDialogrComponents } from '../../util/material.importer';


@Component({
  selector: 'app-signup-success-dialog',
  standalone: true,
  imports: [ importMapDialogrComponents() ],
  templateUrl: './signup-success-dialog.html'
})
export class SignupSuccessDialog {

}
