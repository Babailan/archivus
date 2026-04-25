import { Metadata } from "next";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, GalleryVerticalEnd, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div>
      {/* Your Navigation */}
      <div className="flex justify-between items-center p-5 top-0 bg-background z-10 sticky">
        <div>
          <span className="font-medium flex items-center gap-1 font-garamond">
            <Button size="icon">
              <GalleryVerticalEnd />
            </Button>
            Manny So Christian Academy
          </span>
        </div>
        <div className="gap-2 flex">
          <Link href={"/enroll"}>
            <Button size={"lg"} variant={"secondary"}>
              <School /> Find your school
            </Button>
          </Link>
          <Link href={"/enroll"}>
            <Button size={"lg"} variant={"default"}>
              <ArrowRight /> Enroll Now
            </Button>
          </Link>
        </div>
      </div>

      <div className="min-h-screen relative overflow-hidden">
        {/* The Background Image */}
        <div className="absolute inset-0 -z-10 bg-background">
          <Image
            src="/cambridge.jpg"
            alt="Background"
            fill
            className="object-cover grayscale-50" // Adjust opacity for the "blend" effect
            priority
          />
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
      <SecondSection />
      <Footer />
    </div>
  );
}

function SecondSection() {
  return (
    <div className="md:p-15">
      <div className="grid grid-cols-2">
        <h1 className="text-[clamp(1rem,4vw,10rem)] font-garamond">
          What we can offer?
        </h1>
        <p className="">
          Cambridge and Boston were key sites during the revolutionary period. A
          special self-guided, mobile tour from Harvard offers unique insights
          about notable places on and around campus and reveals the historical
          context behind them.
        </p>
      </div>
      <div className="grid gap-5 grid-cols-3 mt-5">
        <Card className="rounded-none pt-0 bg-primary text-white">
          <AspectRatio ratio={16 / 9}>
            <Image src={"/holistic_image.jpg"} alt="Holistic Images" fill />
          </AspectRatio>
          <CardContent className="p-10 flex flex-col gap-3">
            <h1 className="text-3xl font-garamond">Holistic development</h1>
            <p className="text-base">
              Education extends beyond the classroom. A school should offer
              opportunities for students to grow physically, emotionally, and
              socially.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-none pt-0 bg-primary text-white">
          <AspectRatio ratio={16 / 9}>
            <Image src={"/holistic_image.jpg"} alt="Holistic Images" fill />
          </AspectRatio>
          <CardContent className="p-10 flex flex-col gap-3">
            <h1 className="text-3xl font-garamond">Holistic development</h1>
            <p className="text-base">
              Education extends beyond the classroom. A school should offer
              opportunities for students to grow physically, emotionally, and
              socially.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-none pt-0 bg-primary text-white">
          <AspectRatio ratio={16 / 9}>
            <Image src={"/holistic_image.jpg"} alt="Holistic Images" fill />
          </AspectRatio>
          <CardContent className="p-10 flex flex-col gap-3">
            <h1 className="text-3xl font-garamond">Holistic development</h1>
            <p className="text-base">
              Education extends beyond the classroom. A school should offer
              opportunities for students to grow physically, emotionally, and
              socially.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand Section */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 font-garamond">
              Maniso Christian Academy
            </h2>
            <p className="max-w-sm text-sm leading-relaxed">
              We believe that the best learning happens when we work together,
              sharing insights and solving problems as a community.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex-1 md:ml-12">
            <h3 className="font-semibold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Our Projects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="flex-1">
            <h3 className="font-semibold mb-4 uppercase tracking-wider text-sm">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-secondary rounded-full transition-all"
              >
                🐦
              </a>
              <a
                href="#"
                className="p-2 bg-secondary rounded-full transition-all"
              >
                🐙
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t text-center text-sm ">
          <p>
            &copy; {currentYear} Manny So Christian Academy. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
