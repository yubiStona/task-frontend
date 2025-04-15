import { apiSlice } from "../../app/apiSlice";

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => ({
        url: "/tasks/",
      }),
      providesTags: ["Task"],
    }),
    getTask: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    getMyTasks: builder.query({
      query: () => "/tasks/my-tasks",
      providesTags: ["Task"],
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: "/tasks/",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: task,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Task", id },
        "Task",
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
} = tasksApi;
