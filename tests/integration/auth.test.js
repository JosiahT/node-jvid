const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const request = require("supertest");
let server;
describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if no token is invalid", async () => {
    token = null; //when we call set('x-auth-token', token) above, whatever we pass to token (in this case null) will be converted to a string and will become 'null'

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
