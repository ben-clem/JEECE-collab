import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import {
  ConversationWithUserIdsQuery,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  UsersByFnOrLnOrSnOrPnLikeWordsInStringDocument,
  UsersByFnOrLnOrSnOrPnLikeWordsInStringQuery,
} from "../graphql/generated";
import { betterUpdateQuery } from "../utils/betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        ConvResponse: (data) => data._id as string,
        Conversation: (data) => data.uuid as string,
        ConvToUser: (data) => data.convToUserId as string,
      },
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
          // createConversationWithUserIds(_result, args, cache, info) {
          //     cache.invalidate({
          //       __typename: "Conversation",
          //       id: args.uuid as string,
          //     });
            
          // },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
