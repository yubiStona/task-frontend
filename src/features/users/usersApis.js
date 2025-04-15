import { apiSlice } from "../../app/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users/",
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "/users/",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUserTasks: builder.query({
      query: (userId) => `/users/${userId}/tasks`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserTasksQuery,
} = usersApi;
