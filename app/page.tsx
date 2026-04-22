import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div className="min-h-screen relative overflow-hidden">
      {/* The Background Image */}
      <div className="absolute inset-0 -z-10 bg-background">
        <Image
          src="/cambridge.jpg"
          alt="Background"
          fill
          className="object-cover opacity-50   mask-b-from-60% mask-b-to-100%" // Adjust opacity for the "blend" effect
          priority
        />
      </div>
      {/* Your Navigation */}
      <div className="flex justify-between items-center p-8 relative">
        <div>
          <span className="font-medium flex items-center gap-1 text-white font-garamond">
            <Button size="icon">
              <GalleryVerticalEnd />
            </Button>
            Manny So Christian Academy
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm md:gap-4 absolute top-0 right-0">
        <Link href={"/enroll"}>
        <button className="px-8 py-5 font-bold bg-primary text-white flex justify-center items-center gap-2 cursor-pointer">
          <ArrowRight /> Enroll Now
        </button>
        </Link>
      </div>

      {/* Your Hero Content */}
      <div className="p-2 flex flex-col justify-center text-center gap-4 items-center m-auto mt-20">
        <Badge className="bg-primary text-white">
          Introducing Manny So Christian Academy <ArrowRight />
        </Badge>
        <h1 className="leading-tighter font-garamond text-3xl font-semibold tracking-tight text-balance text-white lg:leading-[1.1] xl:text-5xl max-w-4xl">
          Manny So Christian Academy
        </h1>
        <p className="max-w-4xl text-base text-balance text-white sm:text-lg">
          Our academy prides itself on providing a high-quality education that
          focuses on holistic development and character formation.
        </p>
      </div>
    </div>
    <div>
      TEST
    </div>
    </>
  );
}
