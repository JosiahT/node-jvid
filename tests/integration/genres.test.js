const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
let server;
describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });
  /*
    The reason we're requiring and closing the server for each test run is the server will listen on port 3000 on first run and when you make changes and jest reruns your test, if the server is not closed, when it loads another server and tries to listen on 3000, there's already a server listening and it will throw an exception
    */
  describe("GET /", () => {
    it("should return all genres", async () => {
      //populating test DB
      Genre.collection.insertMany([{ name: "genre1" }, { name: "genre2" }]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
    });
  });
  //testing routes with parameters
  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = await Genre.create({ name: "Genre1" });
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Genre1");
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return a 404 if invalid id is passed", async () => {
      const genreid = 1; //mongoose.Types.ObjectId;
      const res = await request(server).get("/api/genres/" + genreid);
      expect(res.status).toBe(404);
    });

    it("should return a 404 if no genre with input id exists", async () => {
      const genreid = mongoose.Types.ObjectId;
      const res = await request(server).get("/api/genres/" + genreid);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token, name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
      //in ES6 if key and value are the same for an object like {name: name}, we can rewrite it as {name}
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Genre1";
    });

    //testing the authorization to create a new genre
    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });
    //testing invalid inputs
    it("should return 400 if genre is less than 3 characters", async () => {
      name = "gg";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is greater than 50 characters", async () => {
      name = new Array(52).join("g");

      const res = await exec(); //clean way of generating n-1 character string

      expect(res.status).toBe(400);
    });
    //testing the happy paths
    it("should save the genre if it is valid", async () => {
      const res = await exec();
      const genre = await Genre.find({ name });

      expect(genre).not.toBeNull();
    });
    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", name);
    });
  });
});
