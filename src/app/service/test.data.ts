import { Author, Book, Genre } from "../model/model";

export const GENRE_TEST_DATA:Genre[] = [
    {
        id: "",
        name: "Ciencia ficción",
        description: "Escenarios ficticios"
    },
    {
        id: "2",
        name: "Drama",
        description: ""
    }
]

export const AUTHOR_TEST_DATA:Author[] = [
    {
        "id": "960c",
        "fullname": "Robim Sharma",
        "country": "Canada"
    },
    {
        "id": "b0a8",
        "fullname": "Julio Berne",
        "country": "Italia"
    },
    {
        "id": "597a",
        "fullname": "Dale Carnegie",
        "country": "Estados Unidos"
    }
]

export const BOOK_TEST_DATA:Book[] = [
    {
        "name": "El monje que vendio su ferrari",
        "author": {
          "id": "960c",
          "fullname": "Robim Sharma",
          "country": "Canada"
        },
        "genre": {
          "id": "7b89",
          "name": "Superacion personal",
          "description": ""
        },
        "year": "2011",
        "id": "adb7"
      },
      {
        "name": "La vuelta al mundo en 80 dias",
        "author": {
          "id": "b0a8",
          "fullname": "Julio Berne",
          "country": "Italia"
        },
        "genre": {
          "name": "Ciencia Ficción",
          "description": "Plantea escenarios ficticion e imaginarios",
          "id": "934d"
        },
        "year": "1850",
        "id": "0025"
      },
      {
        "id": "88f6",
        "name": "Como hacer amigos e influir sobre las personas",
        "author": {
          "id": "597a",
          "fullname": "Dale Carnegie",
          "country": "Estados Unidos"
        },
        "genre": {
          "id": "7b89",
          "name": "Superacion personal",
          "description": ""
        },
        "year": ""
      }
]