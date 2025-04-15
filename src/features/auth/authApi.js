import { apiSlice } from "../../app/apiSlice";
import { logout } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
    }),
    getCsrfToken: builder.query({
      query: () => ({
        url: "/csrf-token",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetCsrfTokenQuery,
} = authApi;
