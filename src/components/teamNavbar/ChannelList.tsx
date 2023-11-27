"use client";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ChannelListProps {
  channels: {
    id: number;
    name: string;
    publicId: string;
    teamId: number;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
}
const ChannelList = ({ channels }: ChannelListProps) => {
  const params = useParams();

  const navigation = channels.map((item) => {
    const isActive = params.channelId === item.publicId;
    return {
      name: item.name,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      href: `/team/${params.teamPublicId}/channels/${item.publicId}`,
      icon: Hash,
      current: isActive,
    };
  });
  return (
    <>
      {navigation.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={cn(
              item.current
                ? "bg-gray-800 "
                : "text-gray-400 hover:bg-gray-800 hover:text-white",
              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
            )}
          >
            <item.icon
              className={cn(
                item.current
                  ? "text-white"
                  : "text-gray-400 group-hover:text-white",
                "h-6 w-6 shrink-0",
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        </li>
      ))}
    </>
  );
};

export default ChannelList;
