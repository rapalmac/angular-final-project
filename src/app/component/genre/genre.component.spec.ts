import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { GenreService } from "../../service/app.services";
import { GenreComponent } from "./genre.component";
import { isErrorPresent, setFormValue } from "../../shared/util/test.util";
import { of } from "rxjs";
import { GENRE_TEST_DATA } from "../../service/test.data";

describe("GenreComponent", () => {
    let fixture:ComponentFixture<GenreComponent>;
    let component:GenreComponent;
    let el:DebugElement;
    let service:GenreService;

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
            fixture = TestBed.createComponent(GenreComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
            service = TestBed.inject(GenreService);
        });        
    }));

    beforeEach(() => {
        expect(component).toBeTruthy();
    })

    it("should check required form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            name: "",
            description: ""
        });

        expect(isErrorPresent(form, "name", "required")).toBeTrue();

        //Try out to set some values
        setFormValue(form, {...form.value, name:"a"});
        expect(isErrorPresent(form, "name", "required")).toBeFalse();
    });

    it("should check minlength form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            name: "aa",
            description: "aa"
        });

        expect(isErrorPresent(form, "name", "minlength")).toBeTrue();
        expect(isErrorPresent(form, "description", "minlength")).toBeTrue();

        setValue(form, {name:"Comedia", description: "Risas, escenarios divertidos"});
        expect(isErrorPresent(form, "name", "minlength")).toBeFalse();
        expect(isErrorPresent(form, "description", "minlength")).toBeFalse();
    });

    it ("should perform save", () => {
        spyOn(service, "add").and.returnValue(of());
        spyOn(service, "listAll").and.returnValue(of([]));

        let form:FormGroup = component.formGroup;
        setValue(form, {
            name:"Comedia", 
            description: "Risas, escenarios divertidos"
        });

        el.query(By.css("button[type=submit]")).nativeElement.click();
        expect(service.add).toHaveBeenCalled();
        expect(service.listAll).toHaveBeenCalled();
    });

    it ("should perform update", () => {
        spyOn(service, "update").and.returnValue(of(GENRE_TEST_DATA[1]));
        spyOn(service, "listAll").and.returnValue(of(GENRE_TEST_DATA));

        component.dataSource.data = GENRE_TEST_DATA;
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

