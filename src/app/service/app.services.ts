import { Injectable } from "@angular/core";
import { Observable, Subject, map, of, switchMap, tap } from "rxjs";
import { AuthDetails, Course, Order, Picture, User } from "../model/model";
import { HttpService } from "./http.service";

export const USERS_URL = "http://localhost:3000/users";
export const ORDERS_URL = "http://localhost:3000/orders";
export const COURSES_URL = "http://localhost:3000/courses";
export const PICTURES_URL = "http://localhost:3000/pictures";


export interface AuthObject {
    status: "success" | "failed";
    error?:string;
}

@Injectable({
    providedIn: "root"
})
export class CourseService extends HttpService<Course> {
    getUrl(): string {
        return COURSES_URL;
    }
}

@Injectable({
    providedIn: "root"
})
export class PictureService extends HttpService<Picture> {
    getUrl(): string {
        return PICTURES_URL;
    }
}
const AUTH_DETAILS = "user-token";

export interface UserDetails {
    user:User;
    picture?:Picture;
}

@Injectable({
    providedIn: "root"
})
export class UserService extends HttpService<User> {
    public onAuthenticationCompleted:Subject<AuthObject> = new Subject();
    private userDetails!:UserDetails | null;
    onLoadUserDetailsCompleted = new Subject<UserDetails>();

    getUrl(): string {
        return USERS_URL;
    }

    getAuthDetails():AuthDetails | null{
        if (!this.isAuthenticated) {
            return null;
        } else {
            let _storageItem:any = localStorage.getItem(AUTH_DETAILS);
            return JSON.parse(_storageItem);
        }
    }

    loadUserDetails(force?:boolean):Observable<UserDetails> {
        if (!this.userDetails || force) {            
            let auth = this.getAuthDetails();
            if (auth) {
                return this.get(auth.userId).pipe(
                    switchMap((user) => {
                        if (user.pictureId) {
                            return this.http.get<Picture>(`${PICTURES_URL}/${user.pictureId}`).pipe(
                                map(picture => {
                                    this.userDetails ={
                                            user, picture
                                    }
                                    this.onLoadUserDetailsCompleted.next(this.userDetails);
                                    return this.userDetails;
                                })
                            )
                        }

                        this.userDetails = {
                            user
                        };
                        this.onLoadUserDetailsCompleted.next(this.userDetails);
                        return of(this.userDetails);
                    })
                );
            }

            return of();
        } else {
            return of(this.userDetails);
        }
    }

    resetUserDetails():void {
        this.userDetails = null;
    }

    isAuthenticated():boolean {
        return localStorage.getItem(AUTH_DETAILS) != null;
    }

    authenticate(user:Partial<User>) {
        this.filter({
            email: user.email
        }).subscribe(data => {
            if (data && data.length > 0) {
                let _user = data[0] as User;

                if (user.password == _user.password) {
                    this.loadUserDetails(true);
                    localStorage.setItem(AUTH_DETAILS, JSON.stringify({
                        userId: _user.id,
                        email: _user.email,
                        token: "Token"
                    }));
                    this.onAuthenticationCompleted.next({
                        status: "success"
                    });
                } else {
                   this.onAuthenticationCompleted.next({
                    status: "failed",
                    error: "Invalid password."
                   });
                   localStorage.removeItem(AUTH_DETAILS);
                }

                return;
            }
            
            this.onAuthenticationCompleted.next({
                status: "failed",
                error: "Invalid user."
            });
            localStorage.removeItem(AUTH_DETAILS);
        });
    }

    logout():void {
        localStorage.removeItem(AUTH_DETAILS);
        this.userDetails = null;
    }

    updatePicture(user: User, pictureStr: string | undefined):Observable<User> {
        if (pictureStr) {
            return this.http.post<Picture>(PICTURES_URL, {
                picture: pictureStr
            }).pipe(
                switchMap((picture) => {
                    return this.update(user.id, {
                        ...user,
                        pictureId: picture.id
                    });
                })
            )
        }

        return of(user);
    }
}

export interface CartObject {
    course:Course;
    quantity:number;
}

@Injectable({
    providedIn: "root"
})
export class CartService extends HttpService<Order> {
    private _cart:Course[];
    onCourseCartChanged:Subject<Course[]>;

    constructor() {
        super();
        this._cart = [];
        this.onCourseCartChanged = new Subject();
    }

    getUrl():string {
        return ORDERS_URL;
    }

    get cart() {
        return this._cart;
    }

    addToCard(course:Course) {        
        let index = this._cart.findIndex(c => c.id == course.id);

        if (!index || index < 0) {
            this._cart.push(course);
            this.onCourseCartChanged.next(this._cart);
        } else {            
           throw new Error(`The course ${course.name} is already added to the cart.`);
        }
    }

    removeFromCart(course:Course) {
        let index = this._cart.findIndex(c => c.id == course.id);
        if (index != undefined && index >= 0) {
            this._cart = this._cart.filter(c => c.id !== course.id);
            this.onCourseCartChanged.next(this._cart);
        } else {
            throw new Error(`The course ${course.name} is not in the cart list.`);
        }
    }

    createOrder(user:User):Observable<any> {
        return this.add({
            userId: user.id,
            courses: this._cart.map(c => c.id),
            date: new Date(),
            total: this._cart.reduce((sum, o) => sum += o.price, 0)
        }).pipe(
            switchMap((data) => {
                let _courses = user.courses;
                if (!_courses) {
                    _courses = []
                }
                _courses.push(...data.courses);

                return this.http.put<User>(`${USERS_URL}/${user.id}`, {
                    ...user,
                    courses: _courses
                }).pipe(
                    tap(() => {                
                        this._cart = [];
                        this.onCourseCartChanged.next(this._cart);
                    })
                );
            })
        );
    }
}