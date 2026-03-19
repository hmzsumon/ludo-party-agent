import { saveAccessToken } from "@/utils/authToken";
import { IUser } from "../admin/adminApi";
import { apiSlice } from "../api/apiSlice";
import { setUser } from "../auth/authSlice";

export const agentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Agent Login Mutation ────────── */
    agentLogin: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/agent/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;

          /* ────────── persist access token for socket auth ────────── */
          saveAccessToken(result?.data?.token || null);

          /* ────────── sync redux auth state ────────── */
          dispatch(setUser(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    /* ────────── get agents ────────── */
    getAgents: builder.query<any, void>({
      query: () => "/agents",
    }),

    /* ────────── get agent by id ────────── */
    getAgentById: builder.query<any, string>({
      query: (id) => `/agents/${id}`,
    }),

    /* ────────── agent register ────────── */
    agentRegister: builder.mutation<any, any>({
      query: (body) => ({
        url: "/agent-register",
        method: "POST",
        body,
      }),
    }),

    /* ────────── update agent ────────── */
    updateAgent: builder.mutation<any, any>({
      query: (body) => ({
        url: "/agents",
        method: "PUT",
        body,
      }),
    }),

    /* ────────── delete agent ────────── */
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
