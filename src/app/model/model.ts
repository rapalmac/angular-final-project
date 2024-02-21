export interface AuthDetails {
    userId:string;
    email:string;
    token:string;
}

export interface User {
    id:string;
    email:string;
    displayName:string;
    firstName:string;
    lastName:string;
    password:string;
    bio?:string;
    interests?:string[];
    userType: "student" | "professional";
    experience?:string;
    domainExpertise?:string;
    role?:string;
    picture?:string;
}

export interface Author {
    id:string;
    fullname:string;
    country:string;
}

export interface Genre {
    id:string;
    name:string;
    description:string;
}

export interface Book {
    id:string;
    name:string;
    author:Author;
    genre:Genre;
    year:string
}