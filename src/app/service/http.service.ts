import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export abstract class HttpService<Type> {
    http:HttpClient = inject(HttpClient);

    abstract getUrl():string;
    
    add(t:Partial<Type>):Observable<Type> {
        return this.http.post<Type>(this.getUrl(), t);
    }

    update(id:string, t:Type):Observable<Type> {
        return this.http.put<Type>(`${this.getUrl()}/${id}`, t);
    }

    listAll():Observable<Type[]> {
        return this.http.get<Type[]>(this.getUrl());
    }

    get(id:string):Observable<Type> {
        return this.http.get<Type>(`${this.getUrl()}/${id}`);
    }

    filter(params:any):Observable<Type[]> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            httpParams = httpParams.set(key, params[key]);
        });

        return this.http.get<Type[]>(this.getUrl(), {
            params: httpParams
        });
    }
}