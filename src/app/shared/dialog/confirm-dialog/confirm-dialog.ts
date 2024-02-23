import { Component, Inject } from '@angular/core';
import { importMapDialogrComponents } from '../../util/material.importer';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogObj {
  title:string;
  message:string;
}

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [ importMapDialogrComponents() ],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data:DialogObj) {
    
  }
}
