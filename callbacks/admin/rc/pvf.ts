import axios, { AxiosResponse } from "axios";

import { errorNotification } from "@callbacks/notifcation";
import {
  ADMIN_URL,
  ErrorType,
  SERVER_ERROR,
  StatusResponse,
  setConfig,
} from "@callbacks/constants";

const instance = axios.create({
  baseURL: ADMIN_URL,
  timeout: 15000,
  timeoutErrorMessage: SERVER_ERROR,
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export interface AllStudentPvfResponse {
  pvfid: string;
  CreatedAt: string;
  UpdatedAt: string;
  name: string;
  email: string;
  roll_no: string;
  pvf: string;
  verified: {
    Bool: boolean;
    Valid: boolean;
  };
  action_taken_by: string;
}

const adminPvfRequest = {
  getAll: (token: string, rid: string) =>
    instance
      .get<AllStudentPvfResponse[]>(
        `/api/admin/application/rc/${rid}/pvf`,
        setConfig(token)
      )
      .then(responseBody)
      .catch((err: ErrorType) => {
        errorNotification("Error", err.response?.data?.error || err.message);
        return [] as AllStudentPvfResponse[];
      }),
  get: (token: string, rid: string, pid: string) =>
    instance
      .get<AllStudentPvfResponse>(`/${rid}/pvf/${pid}`, setConfig(token))
      .then(responseBody)
      .catch((err: ErrorType) => {
        errorNotification("Error", err.response?.data?.error || err.message);
        return {} as AllStudentPvfResponse;
      }),
  generateAuth: (token: string, rid: string, pid: string) =>
    instance
      .get<StatusResponse>(
        `/${rid}/pvf/${pid}/verification/send`,
        setConfig(token)
      )
      .then(responseBody)
      .catch((err: ErrorType) => {
        errorNotification("Error", err.response?.data?.error || err.message);
        throw err;
      }),
  delete: (token: string, rid: string, pid: string) =>
    instance
      .delete<StatusResponse>(`/${rid}/pvf/${pid}`, setConfig(token))
      .then(responseBody)
      .catch((err: ErrorType) => {
        errorNotification("Error", err.response?.data?.error || err.message);
        throw err;
      }),
  update: (token: string, rid: string, body: AllStudentPvfResponse) =>
    instance
      .put<StatusResponse>(`/${rid}/pvf`, body, setConfig(token))
      .then(responseBody)
      .catch((err: ErrorType) => {
        errorNotification("Error", err.response?.data?.error || err.message);
        throw err;
      }),
};

export default adminPvfRequest;
