import { IUser } from "../admin/adminApi";
import { apiSlice } from "../api/apiSlice";

export const agentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Admin Login Mutations ────────── */
    agentLogin: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/agent/login",
        method: "POST",
        body,
      }),
    }),
    // get agents from api with typescript
    getAgents: builder.query<any, void>({
      query: () => "/agents",
    }),

    // get agent by id from api with typescript
    getAgentById: builder.query<any, string>({
      query: (id) => `/agents/${id}`,
    }),

    // agent register
    agentRegister: builder.mutation<any, any>({
      query: (body) => ({
        url: "/agent-register",
        method: "POST",
        body,
      }),
    }),

    // update agent
    updateAgent: builder.mutation<any, any>({
      query: (body) => ({
        url: "/agents",
        method: "PUT",
        body,
      }),
    }),

    // delete agent
    deleteAgent: builder.mutation<any, string>({
      query: (id) => ({
        url: `/agents/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAgentLoginMutation,
  useGetAgentsQuery,
  useGetAgentByIdQuery,
  useAgentRegisterMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
} = agentApi;
