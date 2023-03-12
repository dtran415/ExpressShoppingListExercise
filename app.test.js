process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const fakeDb = require("./fakeDb");

beforeEach(() => {
    this.item1 = {"name":"item1", "price":1};
    fakeDb.push(this.item1);
});

afterEach(() => {
    fakeDb.length = 0;
});

describe("GET /items", function() {
    it("should get a list items", async function() {
        const response = await request(app).get("/items");
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body[0] == this.item1);
    });
});

describe("GET /items/:name", function() {
    it("should get details on an item by name", async function() {
        const response = await request(app).get("/items/item1");
        expect(response.statusCode).toBe(200);
        expect(response.body == this.item1);
    });

    it("should give a not found error if a bad name is supplied", async function() {
        const response = await request(app).get("/items/abc");
        expect(response.statusCode).toBe(404);
    });
});

describe("POST /items", function() {
    it("should add an item", async function() {
        const response = await request(app).post("/items").send({name: "item2", price: 2});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("added");
        expect(response.body.added.name).toEqual("item2")
        expect(response.body.added.price).toEqual(2)
        expect(fakeDb.length).toEqual(2);
    });

    it("should give an error if name and price is missing", async function() {
        const response = await request(app).post("/items").send({});
        expect(response.statusCode).toBe(400);
    });

    it("should give an error if name is missing", async function() {
        const response = await request(app).post("/items").send({price: 2});
        expect(response.statusCode).toBe(400);
    });

    it("should give an error if price is missing", async function() {
        const response = await request(app).post("/items").send({name: "item2"});
        expect(response.statusCode).toBe(400);
    });

    it("should give an error if price is not a number", async function() {
        const response = await request(app).post("/items").send({name: "item2", price: "abc"});
        expect(response.statusCode).toBe(400);
    });
});

describe("PATCH /items/:name", function() {
    it("should update an item", async function() {
        const response = await request(app).patch("/items/item1").send({name: "item3", price: 3});
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("updated");
        expect(response.body.updated.name).toEqual("item3")
        expect(response.body.updated.price).toEqual(3)

        const find = fakeDb.find(ele => ele.name=="item3" && ele.price==3);
        expect(find).toBeTruthy();
    });

    it("should give an error if name and price is not supplied", async function() {
        const response = await request(app).patch("/items/item1").send({});
        expect(response.statusCode).toBe(400);
    });

    it("should give an error if name is not supplied", async function() {
        const response = await request(app).patch("/items/item1").send({price:3});
        expect(response.statusCode).toBe(400);
    });

    it("should give an error if price is not supplied", async function() {
        const response = await request(app).patch("/items/item1").send({name:"item3"});
        expect(response.statusCode).toBe(400);
    });

    it("should give an error if name is not found in items", async function() {
        const response = await request(app).patch("/items/item3").send({name:"item4", price:4});
        expect(response.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", function() {
    it("should delete an item that exists", async function() {
        const response = await request(app).delete("/items/item1")
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Deleted");
    });

    it("should give an error for an item that is not found", async function() {
        const response = await request(app).delete("/items/abc")
        expect(response.statusCode).toBe(404);
    });
});