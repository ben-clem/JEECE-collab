import { useRouter } from "next/router";
import { useConversationByUuidQuery } from "../graphql/generated";

export const useGetConversationFromUrl = () => {
  const router = useRouter();

  return useConversationByUuidQuery({
    variables: {
      uuid: router.query.uuid as string,
    },
  });
};
