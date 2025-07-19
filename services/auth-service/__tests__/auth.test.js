import request from "supertest";
import app from "../src/app.js";

describe('Testing the signup flow', () => {
    const userData = {
        email: "dreamflowers639@gmail.com",
        username: "sumeshs",
        password: "password"
    };
    const missingBody = {};
    let tokens;
    //try to signup with a empty field
    it('should return a Bad Request', async () => {
        const res = await request(app)
                .post("/api/auth/signup")
                .send(missingBody);
        expect(res.statusCode).toBe(400);    
    });

    it('should signup the user', async () => {
        const res = await request(app)
                .post("/api/auth/signup")
                .send(userData);

        tokens = res.body;
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    }, 7000);

    it('should return conflict error', async () => {
        const res = await request(app)
                .post("/api/auth/signup")
                .send(userData);

        expect(res.statusCode).toBe(409);
    }, 10000);

    it('should return bad request', async () => {
        const res = await request(app)
                .post("/api/auth/signin")
                .send(missingBody);

        expect(res.statusCode).toBe(400);
    });

    it('should return unauthourized error', async () => {
        const res = await request(app)
                .post("/api/auth/signin")
                .send({username : "sumeshs", password: "fake"});

        expect(res.statusCode).toBe(401);
    });

    it('should sigin the user', async () => {
        const res = await request(app)
                .post("/api/auth/signin")
                .send({username : userData.username, password: userData.password});

        tokens = res.body;
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });

    it('should logout the user', async () => {
        const res = await request(app)
                .post("/api/auth/logout")
                .send({refresh_token : tokens.refreshToken});
        expect(res.statusCode).toBe(200);
    });
});
