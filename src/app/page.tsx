import Hero from "@/components/landingPage/Hero";
import Footer from "@/components/landingPage/footer";
import Pricing from "@/components/landingPage/pricing";
import { api } from "@/trpc/server";
import { utcToZonedTime } from "date-fns-tz";

export default function Home() {
  const date = new Date();
  const nytime = utcToZonedTime(Date.now(), "America/New_York");
  const paristime = utcToZonedTime(Date.now(), "Europe/Paris");
  console.log(date.toUTCString());
  return (
    <>
      <div className="flex flex-col">
        <div>{Date.now()}</div>
        <div>{date.toISOString()}</div>
        <div>{date.toUTCString()}</div>
        <div>{nytime.toLocaleString()}</div>
        <div>{paristime.toLocaleString()}</div>
      </div>
      <Hero />
      <Pricing />
      <Footer />
    </>
  );
}
