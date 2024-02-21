import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { BookService } from "../../service/app.services";
import { BookComponent } from "./book.component";
import { isErrorPresent, setFormValue } from "../../shared/util/test.util";
import { of } from "rxjs";
import { AUTHOR_TEST_DATA, BOOK_TEST_DATA, GENRE_TEST_DATA } from "../../service/test.data";

describe("BookComponent", () => {
    let fixture:ComponentFixture<BookComponent>;
    let component:BookComponent;
    let el:DebugElement;
    let service:BookService;

    function setValue(form:FormGroup, value:any) {
        setFormValue(form, value);
        fixture.detectChanges();
    }

    beforeEach(waitForAsync (() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                provideAnimationsAsync()
            ]
        }).compileComponents().then(() => {
          fixture = TestBed.createComponent(BookComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement;
          service = TestBed.inject(BookService);
        });
    }));

    beforeEach(() => {
        expect(component).toBeTruthy();
    })

    it("should check required form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            name: "",
            author: "",
            genre: "",
            year: ""
        });

        expect(isErrorPresent(form, "name", "required")).toBeTrue();
        expect(isErrorPresent(form, "author", "required")).toBeTrue();
        expect(isErrorPresent(form, "genre", "required")).toBeTrue();
        expect(isErrorPresent(form, "year", "required")).toBeFalse();

        //Try out to set some values
        setFormValue(form, {
          name: "Libro",
          author: {id: ""},
          genre: {id: ""},
          year: "1997"
      });
        expect(isErrorPresent(form, "name", "required")).toBeFalse();
        expect(isErrorPresent(form, "author", "required")).toBeFalse();
        expect(isErrorPresent(form, "genre", "required")).toBeFalse();
        expect(isErrorPresent(form, "year", "required")).toBeFalse();
    });

    it("should check minlength form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            name: "Una",
            author: AUTHOR_TEST_DATA[1],
            genre: GENRE_TEST_DATA[1],
            year: "97"
        });

        expect(isErrorPresent(form, "name", "minlength")).toBeTrue();
        expect(isErrorPresent(form, "year", "minlength")).toBeTrue();

        setValue(form, {
          name:"Pablo Perez", 
          author: AUTHOR_TEST_DATA[1],
          genre: GENRE_TEST_DATA[1],
          year: "1997"
        });
        expect(isErrorPresent(form, "name", "minlength")).toBeFalse();
        expect(isErrorPresent(form, "year", "minlength")).toBeFalse();

        setValue(form, {
          ...form.value,
          year: "20023"
        });
        expect(isErrorPresent(form, "year", "maxlength")).toBeTrue();
    });

    it ("should perform save", () => {
        spyOn(service, "add").and.returnValue(of());
        spyOn(service, "listAll").and.returnValue(of([]));

        let form:FormGroup = component.formGroup;
        setValue(form, {
          name:"Pablo Perez", 
          author: AUTHOR_TEST_DATA[1],
          genre: GENRE_TEST_DATA[1],
          year: "1997"
        });

        el.query(By.css("button[type=submit]")).nativeElement.click();
        expect(service.add).toHaveBeenCalled();
        expect(service.listAll).toHaveBeenCalled();
    });

    it("should check only numbers form validations", () => {
      let form:FormGroup = component.formGroup;
      setValue(form, {
          name: "Nuevo libro",
          author: AUTHOR_TEST_DATA[1],
          genre: GENRE_TEST_DATA[1],
          year: "1997a"
      });

      expect(isErrorPresent(form, "year", "pattern")).toBeTrue();
    });

    it ("should perform update", () => {
        spyOn(service, "update").and.returnValue(of(BOOK_TEST_DATA[1]));
        spyOn(service, "listAll").and.returnValue(of(BOOK_TEST_DATA));

        component.dataSource.data = BOOK_TEST_DATA;
        fixture.detectChanges();

        //Click on the fisrt row of the mat table.
        el.query(By.css("tr td")).nativeElement.click();

        //Make sure the data have been loaded in the form.
        let form:FormGroup = component.formGroup;
        expect(form.value).toBeTruthy();
        expect(component.selection.isSelected()).toBeTrue();
        fixture.detectChanges();

        //Click on the update button
        el.query(By.css("#updateBtn")).nativeElement.click();
        expect(service.update).toHaveBeenCalled();
        expect(service.listAll).toHaveBeenCalled();

        expect(component.selection.isSelected()).toBeFalse();
    });

    it ("should perform table filtering", () => {
        component.dataSource.data = BOOK_TEST_DATA;
        fixture.detectChanges();
        expect(component.dataSource.data.length).toEqual(3);

        //Apply filtering.
        component.onTableFilter({
          target: {
            value: "hacer amigos"
          }
        });
        fixture.detectChanges();

        expect(component.dataSource.filter).toEqual("hacer amigos");
        expect(component.dataSource.filteredData).toBeTruthy();
        expect(component.dataSource.filteredData.length).toEqual(1);

        //Remove filtering.
        component.onTableFilter({
          target: {
            value: ""
          }
        });
        fixture.detectChanges();
        expect(component.dataSource.filter).not.toBeTruthy();
    });
});

