import { Injectable } from "@angular/core";
import { Observable, Subject, map, of } from "rxjs";
import { AuthDetails, Author, Book, Genre, User } from "../model/model";
import { HttpService } from "./http.service";

@Injectable({
    providedIn: "root"
})
export class AuthorService extends HttpService<Author> {
    getUrl(): string {
        return "http://localhost:3000/authors";
    }
}

export interface AuthObject {
    status: "success" | "failed";
    error?:string;
}

@Injectable({
    providedIn: "root"
})
export class GenreService extends HttpService<Genre> {
    getUrl(): string {
        return "http://localhost:3000/genres";
    }
}

@Injectable({
    providedIn: "root"
})
export class BookService extends HttpService<Book> {
    getUrl(): string {
        return "http://localhost:3000/books";
    }
}



const AUTH_DETAILS = "user-token";

@Injectable({
    providedIn: "root"
})
export class UserService extends HttpService<User> {
    public onAuthenticationCompleted:Subject<AuthObject> = new Subject();
    private userDetails!:User | null;
    onLoadUserDetailsCompleted = new Subject<User>();

    getUrl(): string {
        return "http://localhost:3000/users";
    }

    getAuthDetails():AuthDetails | null{
        if (!this.isAuthenticated) {
            return null;
        } else {
            let _storageItem:any = localStorage.getItem(AUTH_DETAILS);
            return JSON.parse(_storageItem);
        }
    }

    loadUserDetails(force?:boolean):Observable<User> {
        if (!this.userDetails || force) {            
            let auth = this.getAuthDetails();
            if (auth) {
                console.log("Loading user details from the backend.");
                return this.get(auth.userId).pipe(
                    map((data) => {
                        this.userDetails = {...data};
                        this.onLoadUserDetailsCompleted.next(this.userDetails);
                        return this.userDetails;
                    })
                );
            }

            return of();
        } else {
            console.log("Loading user details from the service.");
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
                    console.log(user.id);
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
}