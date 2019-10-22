const request = require("supertest");
const {
    Event
} = require("../../models/event");
const {
    User
} = require("../../models/user");
const server = require("../../index");

describe("/api/users/:userId/events", () => {
    let user;
    let token;

    beforeAll(async () => {
        user = new User({
            name: "Test username",
            email: "user1@mail.com",
            password: "password"
        });
        await user.save();
        token = user.generateAuthToken();
    });
    beforeEach(async () => {});
    afterAll(async () => {
        await User.deleteMany({});
    });

    describe("GET /", () => {
        it("should return 401 if not logged in / missing token", async () => {
            const token = "";
            const res = await request(server).get(`/api/users/${user._id}/events`).set("x-auth-token", token);
            expect(res.status).toBe(401);
        });

        it("should return 401 when accessing other user", async () => {
            const otherUser = new User({
                name: "Test username",
                email: "user2@mail.com",
                password: "password"
            });
            const res = await request(server).get(`/api/users/${otherUser._id}/events`).set("x-auth-token", token);
            expect(res.status).toBe(401);
        });

        it("should return events list when logged in", async () => {
            const res = await request(server).get(`/api/users/${user._id}/events`).set("x-auth-token", token);
            expect(res.status).toBe(200);
        });
    });
});