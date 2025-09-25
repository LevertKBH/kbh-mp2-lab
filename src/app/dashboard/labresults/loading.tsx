import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Skeleton className="h-8 w-[150px] lg:w-[250px]" />
          <Skeleton className="h-8 w-[50px] lg:w-[150px]" />
          <Skeleton className="h-8 w-[50px] lg:w-[150px]" />
        </div>
        <Skeleton className="h-8 w-[50px] lg:w-[150px]" />
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
