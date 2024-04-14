"use client";

import { cn } from "@/lib/utils";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CoachDashboardNavProps {
  teamPublicId: string;
}

const CoachDashboardNav = ({ teamPublicId }: CoachDashboardNavProps) => {
  const params = usePathname();

  return (
    <>
      <Link
        href={`/team/${teamPublicId}/dashboard`}
        className={cn(
          params.includes("dashboard")
            ? "bg-gray-800 text-white"
            : " text-gray-400 hover:bg-gray-800 hover:text-white",
          "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
        )}
      >
        <HomeIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
        Team Dashboard
      </Link>
    </>
  );
};

export default CoachDashboardNav;
