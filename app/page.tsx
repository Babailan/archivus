import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, GalleryVerticalEnd } from "lucide-react";

export default function Home() {
  return (
    <div className="p-10">
      <div className="flex justify-between">
        <div>
          <span className="font-medium flex items-center gap-1">
            <Button size={"icon"}>
              <GalleryVerticalEnd />
            </Button>
            Archivus Inc.
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm md:gap-4">dawda</div>
      </div>
      <div className="p-2 flex flex-col justify-center text-center gap-4 items-center m-auto">
        <Badge variant={"secondary"}>
          Introducing Archivus <ArrowRight />{" "}
        </Badge>
        <h1 className="leading-tighter text-3xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter max-w-4xl">
          The Foundation for your School System
        </h1>
        <p className="max-w-4xl text-base text-balance text-foreground sm:text-lg">
          A set of beautifully designed components that you can customize,
          extend, and build on. Start here then make it your own. Open Source.
          Open Code.
        </p>
        <div className="gap-2 flex">
          <Button>Enroll Now</Button>
          <Button variant={"ghost"}>Explore More</Button>
        </div>

        <div className="flex  items-center space-x-4 text-sm">
          <div>Blog</div>
          <Separator orientation="vertical" />
          <div>Docs</div>
        </div>
      </div>
      <SeparatorVertical />
    </div>
  );
}

function SeparatorVertical() {
  return (
    <div className="flex h-5 items-center gap-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  );
}
