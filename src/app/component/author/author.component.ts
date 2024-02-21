import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { importMatComponents } from '../../shared/util/material.importer';
import { Author } from '../../model/model';
import { AuthorService } from '../../service/app.services';
import { SelectionObject } from '../../shared/util/util';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, importMatComponents()],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css'
})
export class AuthorComponent implements AfterViewInit{
  formGroup:any;
  columnsToDisplay = ["fullname", "country"];
  selection:SelectionObject<string>;
  authorService:AuthorService = inject(AuthorService);
  dataSource:MatTableDataSource<Author>;  
  snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(fb:FormBuilder) {
    this.selection = new SelectionObject();
    this.dataSource = new MatTableDataSource();

    this.formGroup = fb.group({
      fullname: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: "blur"
      }],
      country: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: "blur"
      }]
    });
  }

  ngAfterViewInit(): void {
    this.refreshTable();
  }

  refreshTable() {
    this.authorService.listAll().subscribe(data => {
      this.dataSource.data = data
      this.dataSource.paginator = this.paginator
    });
  }

  resetForm() {
    this.formGroup.reset();
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).setErrors(null) ;
    });
    this.selection.reset();
    document.getElementById("fullname")?.focus();
  }

  onSaveForm () {
    if (!this.selection.isSelected()) {
      this.authorService.add(this.formGroup.value).subscribe(() => {
        this.snackBar.open("The author was saved successfuly.", "Ok");
        this.refreshTable();
      });
    } else {      
      this.authorService.update(this.selection.data, this.formGroup.value).subscribe(() => {
        this.snackBar.open("The author was updated successfuly.", "Ok");
        this.refreshTable();
      });
      this.selection.reset();
    }

    this.resetForm();
  }

  onSelectRow(data:Author, event:any) {
    this.selection.setData(data.id);
    this.formGroup.controls.fullname.setValue(data.fullname);
    this.formGroup.controls.country.setValue(data.country);
    document.getElementById("fullname")?.focus();
  }
}
