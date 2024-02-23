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
    pictureId?:string;
    courses?:string[];
}

export interface CourseRate {
    id:string;
    user:Partial<User>;
    rate:number;
    comments:string;
}

export interface Course {
    id:string;
    name:string;
    category: "begginer" | "intermediate" | "advance";
    pictureId?:string;
    price:number;
    rating?:CourseRate[]
}

export interface Order {
    id:string;
    date:Date,
    userId:string,
    courses:string[],
    total:number
}

export interface Picture {
    id:string;
    url:string;
}