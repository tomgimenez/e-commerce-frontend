import { beforeEach, describe, expect, it } from "vitest";
import AxiosMockAdapter from 'axios-mock-adapter';

import { backendApi } from "@/api/backendApi";
import { loginAction } from "./login.action";

describe('LoginAction', () => {

  const backendApiMock = new AxiosMockAdapter(backendApi);
  const mockedResponse = {
    user: { email: 'test@test.com' },
    token: 'new-jwt-token'
  }

  beforeEach(()=> {
    backendApiMock.reset();
  });
  
  it('should return user data and token when login succeed', async () => {
    backendApiMock.onPost('/auth/login').reply(200, mockedResponse);

    const response = await loginAction('test@test.com', 'password');

    expect(response).toStrictEqual(mockedResponse);
  });

  it('should throw error when login fails', async () => {
    backendApiMock.onPost('/auth/login').reply(401, 'invalid credentials');

    await expect(loginAction('test@test.com', 'password')).rejects.toThrow(Error);
  })
})