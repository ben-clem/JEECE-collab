import { useRouter } from "next/router";

export const useGetUuid = () => {
  const router = useRouter();
  const uuid =
    typeof router.query.uuid === "string" ? router.query.uuid : -1;

  return uuid;
};