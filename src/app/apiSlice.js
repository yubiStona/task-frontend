import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = getState().auth.csrfToken;

    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Task"],
  endpoints: () => ({}),
});
