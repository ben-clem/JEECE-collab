import { utimes } from "fs";
import { useRouter } from "next/router";
import { useGetUuid } from "./useGetUuid";

export const useGetConversationFromUrl = () => {
  const intId = useGetUuid();
  return usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
};