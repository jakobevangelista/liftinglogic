"use client";

import { api } from "@/trpc/react";

const Test = () => {
  const data = api.coach.hello.useQuery({ text: "world", teamId: 1 });
  console.log(data.data?.greeting);
  return (
    <>
      <div>Test: {data.data?.greeting}</div>
    </>
  );
};

export default Test;
