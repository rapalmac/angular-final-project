import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Genre } from '../../model/model';
import { GenreService } from '../../service/app.services';
import { importMatComponents } from '../../shared/util/material.importer';
import { SelectionObject } from '../../shared/util/util';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, importMatComponents()],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.css'
})
export class GenreComponent {
  formGroup:any;
  columnsToDisplay = ["fullname", "country"];
  selection:SelectionObject<string>;
  genreService = inject(GenreService);
  dataSource:MatTableDataSource<Genre>;  
  snackBar = inject(MatSnackBar);
  
  constructor(fb:FormBuilder) {
    this.selection = new SelectionObject();
    this.dataSource = new MatTableDataSource();

    this.formGroup = fb.group({
      name: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: "blur"
      }],
      description: ["", {
        validators: [Validators.minLength(10)],
        updateOn: "blur"
      }]
    });
  }

  ngAfterViewInit(): void {
    this.refreshTable();
  }

  refreshTable() {
    this.genreService.listAll().subscribe(data => this.dataSource.data = data);
  }

  resetForm() {
    this.formGroup.reset();
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).setErrors(null) ;
    });
    this.selection.reset();
    document.getElementById("name")?.focus();
  }

  onSaveForm () {
    if (!this.selection.isSelected()) {
      this.genreService.add(this.formGroup.value).subscribe(() => {
        this.snackBar.open("The genre was saved successfuly.", "Ok");
        this.refreshTable();
      });
    } else {      
      this.genreService.update(this.selection.data, this.formGroup.value).subscribe(() => {
        this.snackBar.open("The genre was updated successfuly.", "Ok");
        this.refreshTable();
      });
      this.selection.reset();
    }

    this.resetForm();
  }

  onSelectRow(data:Genre, event:any) {
    this.selection.setData(data.id);
    this.formGroup.controls.name.setValue(data.name);
    this.formGroup.controls.description.setValue(data.description);
    document.getElementById("name")?.focus();
  }
}
