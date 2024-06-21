import { TestDataSource } from "./../../../data-source";
import { User } from "./../../../entity/User";
import { createTypeOrmConn } from "./../../../utils/createTypeOrmConn";
import { confirmEmailError, invalidLogin } from "./errorMessages";
import { loginMutation, registerMutation } from "../shared/testClient";
import { test_url } from "../../../constants";
import axios from "axios";

const username = "bob";
const email = "bob@gmail.com";
const pass = "bob123";

beforeAll(async () => {
  await createTypeOrmConn();
});

afterEach(async () => {
  const userRepository = TestDataSource.getRepository(User);
  await userRepository.clear();
});

describe("login", () => {
  it("should validation err", async () => {
    const response = await axios.post(test_url, {
      query: loginMutation("a", "b"),
    });

    expect(response.data.data.login.errors.length).toEqual(3);
    expect(response.data.data.login.errors).not.toBeNull();
  });

  it("should not confirm email", async () => {
    await axios.post(test_url, {
      query: registerMutation(username, email, pass),
    });

    const {
      data: { data },
    } = await axios.post(test_url, {
      query: loginMutation(email, pass),
    });

    expect(data.login.errors).not.toBeNull();
    expect(data.login.errors).toEqual([
      {
        path: "email",
        message: confirmEmailError,
      },
    ]);
  });

  it("should wrong password", async () => {
    await axios.post(test_url, {
      query: registerMutation(username, email, pass),
    });

    User.update(
      {
        email,
      },
      {
        confirmed: true,
      }
    );

    const {
      data: { data },
    } = await axios.post(test_url, {
      query: loginMutation(email, "abcde"),
    });

    expect(data.login.errors).not.toBeNull();
    expect(data.login.errors).toEqual([
      {
        path: "email",
        message: invalidLogin,
      },
    ]);
  });

  it("should success login", async () => {
    await axios.post(test_url, {
      query: registerMutation(username, email, pass),
    });

    User.update(
      {
        email,
      },
      {
        confirmed: true,
      }
    );

    const {
      data: { data },
    } = await axios.post(test_url, {
      query: loginMutation(email, pass),
    });

    expect(data.login.errors).toBeNull();
    expect(data.login.success).toBeTruthy();
  });
});
