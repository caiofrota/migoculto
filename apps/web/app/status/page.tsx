"use client";

import { fetchData } from "lib/utils";

export default function Page() {
  const { data, isLoading } = fetchData("/api/v1/status");
  return <h1>{isLoading ? "Carregando..." : JSON.stringify(data)}</h1>;
}
