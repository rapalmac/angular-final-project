import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { AuthorService } from "../../service/app.services";
import { AuthorComponent } from "./author.component";
import { isErrorPresent, setFormValue } from "../../shared/util/test.util";
import { of } from "rxjs";
import { AUTHOR_TEST_DATA } from "../../service/test.data";

describe("AuthorComponent", () => {
    let fixture:ComponentFixture<AuthorComponent>;
    let component:AuthorComponent;
    let el:DebugElement;
    let service:AuthorService;

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
            fixture = TestBed.createComponent(AuthorComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
            service = TestBed.inject(AuthorService);
        })
    }));

    beforeEach(() => {
        expect(component).toBeTruthy();
    })

    it("should check required form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            fullname: "",
            country: ""
        });

        expect(isErrorPresent(form, "fullname", "required")).toBeTrue();

        //Try out to set some values
        setFormValue(form, {
          fullname:"a",
          country:"peru"
        });
        expect(isErrorPresent(form, "fullname", "required")).toBeFalse();
    });

    it("should check minlength form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            fullname: "Pablo",
            country: "MEX"
        });

        expect(isErrorPresent(form, "fullname", "minlength")).toBeTrue();
        expect(isErrorPresent(form, "country", "minlength")).toBeTrue();

        setValue(form, {
          fullname:"Pablo Perez", 
          country: "México"
        });
        expect(isErrorPresent(form, "fullname", "minlength")).toBeFalse();
        expect(isErrorPresent(form, "country", "minlength")).toBeFalse();
    });

    it ("should perform save", () => {
        spyOn(service, "add").and.returnValue(of());
        spyOn(service, "listAll").and.returnValue(of([]));

        let form:FormGroup = component.formGroup;
        setValue(form, {
            fullname:"Diego Leiva", 
            country: "Peru"
        });

        el.query(By.css("button[type=submit]")).nativeElement.click();
        expect(service.add).toHaveBeenCalled();
        expect(service.listAll).toHaveBeenCalled();
    });

    it ("should perform update", () => {
        spyOn(service, "update").and.returnValue(of(AUTHOR_TEST_DATA[1]));
        spyOn(service, "listAll").and.returnValue(of(AUTHOR_TEST_DATA));

        component.dataSource.data = AUTHOR_TEST_DATA;
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
});

