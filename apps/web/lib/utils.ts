import { useQuery } from "@tanstack/react-query";

export function fetchData(url: string) {
  return useQuery({
    queryKey: [url],
    queryFn: async (args) => {
      const response = await fetch(args.queryKey[0]);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });
}
