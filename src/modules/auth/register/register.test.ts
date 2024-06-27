import { createTypeOrmConn } from "./../../../utils/createTypeOrmConn";
import { registerMutation } from "./../shared/testClient";
import { test_url } from "./../../../constants";
import axios from "axios";
import { duplicateEmail } from "./errorMessages";

const username = "bob";
const email = "bob@gmail.com";
const pass = "bob123";

beforeAll(async () => {
  await createTypeOrmConn();
});

describe("register", () => {
  it("should validation err", async () => {
    const response = await axios.post(test_url, {
      query: registerMutation("a", "b", "c"),
    });

    expect(response.data.data.register.errors.length).toEqual(4);
    expect(response.data.data.register.errors).not.toBeNull();
  });

  it("should duplicate email", async () => {
    await axios.post(test_url, {
      query: registerMutation(username, email, pass),
    });

    const {
      data: { data },
    } = await axios.post(test_url, {
      query: registerMutation(username, email, pass),
    });

    expect(data.register.errors).not.toBeNull();
    expect(data.register.errors).toEqual([
      {
        path: "email",
        message: duplicateEmail,
      },
    ]);
  });

  it("should register success", async () => {
    const {
      data: { data },
    } = await axios.post(test_url, {
      query: registerMutation(username, email, pass),
    });

    expect(data.register.errors).toBeNull();
    expect(data.register.success).toBeTruthy();
  });
});
