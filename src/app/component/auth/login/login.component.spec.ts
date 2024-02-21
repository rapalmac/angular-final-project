import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { UserService } from "../../../service/app.services";
import { LoginComponent } from "./login.component";
import { isErrorPresent, setFormValue } from "../../../shared/util/test.util";

describe("LoginComponent", () => {
    let fixture:ComponentFixture<LoginComponent>;
    let component:LoginComponent;
    let el:DebugElement;
    let service:UserService;

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
            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
            service = TestBed.inject(UserService);
        })
    }));

    beforeEach(() => {
        expect(component).toBeTruthy();
    })

    it("should check required form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            email: "",
            password: ""
        });

        expect(isErrorPresent(form, "email", "required")).toBeTrue();
        expect(isErrorPresent(form, "password", "required")).toBeTrue();

        //Try out to set some values
        setValue(form, {email:"a", password: "Mypassword1"});
        expect(isErrorPresent(form, "email", "required")).toBeFalse();
        expect(isErrorPresent(form, "password", "required")).toBeFalse();
    });

    it("should check minlength form validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            email: "aa",
            password: "aa"
        });

        expect(isErrorPresent(form, "email", "minlength")).toBeTrue();
        expect(isErrorPresent(form, "password", "minlength")).toBeTrue();

        setValue(form, {email:"myemail", password: "Mypassw"});
        expect(isErrorPresent(form, "email", "minlength")).toBeFalse();
        expect(isErrorPresent(form, "password", "minlength")).toBeFalse();
    });
    
    it("should check password validations", () => {
        let form:FormGroup = component.formGroup;
        setValue(form, {
            email: "mymail@test.com",
            password: "123"
        });

        expect(isErrorPresent(form, "password", "minlength")).toBeTrue();
        expect(isErrorPresent(form, "password", "password")).toBeTrue();

        //Try out new password
        setValue(form, {...form.value, password: "Mypassword"});
        expect(isErrorPresent(form, "password", "password")).toBeTrue();

        //Try a correct password
        setValue(form, {...form.value, password: "Mypassword1"});
        expect(isErrorPresent(form, "password", "password")).toBeFalse();
    });

    it ("should perform login", () => {
        spyOn(service, "authenticate");

        let form:FormGroup = component.formGroup;
        setValue(form, {
            email: "mymail@test.com",
            password: "Myvalid123"
        });

        el.query(By.css("button")).nativeElement.click();
        expect(service.authenticate).toHaveBeenCalled();
    });
});

