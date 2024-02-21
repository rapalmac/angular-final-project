import { Component, ViewChild, inject } from '@angular/core';
import { SelectionObject, modelComparator } from '../../shared/util/util';
import { AuthorService, BookService, GenreService } from '../../service/app.services';
import { MatTableDataSource } from '@angular/material/table';
import { Author, Book, Genre } from '../../model/model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { importMatComponents } from '../../shared/util/material.importer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, importMatComponents()],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  formGroup:any;
  columnsToDisplay = ["name", "author", "genre", "year"];
  selection:SelectionObject<string>;
  bookService = inject(BookService);
  authorService = inject(AuthorService);
  genreService = inject(GenreService);
  dataSource:MatTableDataSource<Book>;  
  availableAuthors!:Observable<Author[]>;
  availableGenres!:Observable<Genre[]>;
  compareFn = modelComparator;
  snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild("filterInput") filterInput!:MatInput;
  
  constructor(fb:FormBuilder) {
    this.selection = new SelectionObject();
    this.dataSource = new MatTableDataSource();

    this.formGroup = fb.group({
      name: ["", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: "blur"
      }],
      author: ["", {
        nonNullable: true,
        validators: [Validators.required],
        updateOn: "blur"
      }],
      genre: ["", {
        nonNullable: true,
        validators: [Validators.required],
        updateOn: "blur"
      }],
      year: ["", {
        nonNullable: true,
        validators: [Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)],
        updateOn: "blur"
      }]
    });
  }

  ngAfterViewInit(): void {
    this.refreshTable();
    this.availableAuthors = this.authorService.listAll();
    this.availableGenres = this.genreService.listAll();

    this.dataSource.filterPredicate = (data: any, filter) => {
      return data.name?.toLowerCase().indexOf(filter.toLowerCase()) != -1; 
    }
  }

  refreshTable() {
    this.bookService.listAll().subscribe(data => {
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
    this.filterInput.value = "";
    document.getElementById("name")?.focus();
  }

  onSaveForm () {    
    if (!this.selection.isSelected()) {
      this.bookService.add(this.formGroup.value).subscribe(() => {
        this.snackBar.open("The book was saved successfuly.", "Ok");
        this.refreshTable();
      });
    } else {      
      this.bookService.update(this.selection.data, this.formGroup.value).subscribe(() => {
        this.snackBar.open("The book was updated successfuly.", "Ok");
        this.refreshTable();
      });
      this.selection.reset();
    }

    this.resetForm();
  }

  onSelectRow(data:Book, event:any) {
    this.selection.setData(data.id);
    this.formGroup.controls.name.setValue(data.name);
    this.formGroup.controls.author.setValue(data.author);
    this.formGroup.controls.genre.setValue(data.genre);
    this.formGroup.controls.year.setValue(data.year);
    document.getElementById("name")?.focus();
  }

  onTableFilter(event:any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
