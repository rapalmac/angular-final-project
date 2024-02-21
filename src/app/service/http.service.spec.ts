import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Genre } from "../model/model";
import { GenreService } from "./app.services";
import { HttpService } from "./http.service";
import { GENRE_TEST_DATA } from "./test.data";

describe("HttpService", () => {
    let httpController:HttpTestingController;
    let httpService:HttpService<Genre>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                GenreService
            ]
        });

        httpController = TestBed.inject(HttpTestingController);
        httpService = TestBed.inject(GenreService);
    });

    afterEach(() => {
        httpController.verify();
    })

    it("should get a single record", () => {
        httpService.get("12").subscribe(data => {
            if (!data) {
                fail("No data found.");
            }

            expect(data.name).toBe("Drama", "Unexpected value for name.");
        });

        let req = httpController.expectOne({
            method: "GET"
            , url: "http://localhost:3000/genres/12"
        });
        req.flush(GENRE_TEST_DATA[1]);

    });

    it("should get a valid record list", () => {
        httpService.listAll().subscribe(data => {
            if (!data) {
                fail("No data found.");
            }

            expect(data.length).toBe(2)
            expect(data[1].name).toBe("Drama", "Unexpected value for name.");
        });

        let req = httpController.expectOne({
            method: "GET"
            , url: "http://localhost:3000/genres"
        });
        req.flush(GENRE_TEST_DATA);
    });

    it("should add a new record", () => {
        let genre = GENRE_TEST_DATA[0];

        httpService.add(genre).subscribe();
        let req = httpController.expectOne({
            method: "POST"
            , url: "http://localhost:3000/genres"
        });

        let body = req.request.body;
        expect(body.name).toBe(genre.name)
        expect(body.description).toBe(genre.description)
    });

    it("should update a record", () => {
        let genre = GENRE_TEST_DATA[1];

        httpService.update(genre.id, genre).subscribe();
        let req = httpController.expectOne({
            method: "PUT"
            , url: `http://localhost:3000/genres/${genre.id}`
        });

        let body = req.request.body;

        expect(body.id).toEqual(genre.id);
        expect(body.name).toEqual(genre.name);
        expect(body.description).toEqual(genre.description);
    });

    it("should filter a list of records", () => {
        httpService.filter({
            id: "1",
            name: "Genre name"
        }).subscribe(data => {
            expect(data).toBeTruthy();
        });

        let req = httpController.expectOne(() => true);
        expect(req.request.method).toBe("GET");

        let params = req.request.params;
        expect(params).toBeTruthy();

        expect(params.get("id")).toEqual("1");
        expect(params.get("name")).toEqual("Genre name");

        req.flush(GENRE_TEST_DATA);
    });
});