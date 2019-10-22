const request = require("supertest");
const { User } = require("../../models/user");
const server = require("../../index");;

describe("/api/users", () => {
    beforeEach(() => {  })
    afterEach(async () => { 
        await User.deleteMany({});
    });

    describe("Register", () => {
        it("should return a new user if valid user is passed", async () => {
            const res = await request(server).post("/api/users").send({ name: "Test username", email: "user@mail.com", password: "password" });
            expect(res.status).toBe(200);
            expect(res.body.id).toBeDefined();
        });

        it("should return 400 if request is incorrect", async () => {
            const res = await request(server).post("/api/users").send({ name: "Test username", password: "password" });
            expect(res.status).toBe(400);
        });

        it("should return 400 if user already registered", async () => {
            const user = new User({ name: "Test username", email: "user@mail.com", password: "password" });
            await user.save();
            const res = await request(server).post("/api/users").send({ name: "Test username", email: "user@mail.com", password: "password" });
            expect(res.status).toBe(400);
        });
    });

    describe("GET /me", () => {
        it("should return 401 if not logged in / missing token", async () => {
            const res = await request(server).get("/api/users/me");
            expect(res.status).toBe(401);
        });

        it("should return current user if logged in", async () => {
            const user = new User({ name: "Test username", email: "user@mail.com", password: "password" });
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server).get("/api/users/me").set("x-auth-token", token);
            expect(res.status).toBe(200);
        });
    });
    describe("PUT /me", () => {
        it("should return 401 if not logged in / missing token", async () => {
            const res = await request(server).put("/api/users/me").send({ name: "Changed name"}); 
            expect(res.status).toBe(401);
        });

        it("should return 400 if data is missing", async () => {
            const user = new User({ name: "Test username", email: "user@mail.com", password: "password" });
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server).put("/api/users/me").set("x-auth-token", token).send();
            expect(res.status).toBe(400);
        });

        it("should return 400 if data is too short", async () => {
            const user = new User({ name: "Test username", email: "user@mail.com", password: "password" });
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server).put("/api/users/me").set("x-auth-token", token).send({ name: "name"});
            expect(res.status).toBe(400);
        });

        it("should return current user if data is changed", async () => {
            const user = new User({ name: "Test username", email: "user@mail.com", password: "password" });
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server).put("/api/users/me").set("x-auth-token", token).send({ name: "Changed name"});
            expect(res.status).toBe(200);
            expect(res.body.name).toBe("Changed name");
        });
    });
});