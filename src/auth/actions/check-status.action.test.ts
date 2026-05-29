import { beforeEach, describe, expect, it, vi } from "vitest";
import AxiosMockAdapter from 'axios-mock-adapter';

import { backendApi } from "@/api/backendApi";
import { checkStatusAction } from "./check-status.action";

describe('checkStatusAction', () => {

  const backendApiMock = new AxiosMockAdapter(backendApi);
  const mockedResponse = {
    user: {email: 'test@test.com'},
    token: 'new-jwt-token'
  }

  beforeEach(()=> {
    backendApiMock.reset();
  });

  it('should return user and new token when current token is valid', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('mocked-token');
    backendApiMock.onGet('/auth/check-status').reply(200, mockedResponse);

    const response = await checkStatusAction();

    expect(response).toStrictEqual(mockedResponse);
  });

  it('should throw error when token not found in local storage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    await expect(
      checkStatusAction()
    ).rejects.toThrow(new Error('no token found'));
  });

  it('should throw error when api call fails', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('mocked-token');
    backendApiMock.onGet('/auth/check-status').networkError();

    await expect(
      checkStatusAction()
    ).rejects.toThrow(new Error('token expired or not valid'));
  });
});