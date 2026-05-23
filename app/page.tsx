import { Metadata } from "next";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex border-b justify-between items-center p-5 top-0 bg-background z-20 sticky">
        <div>
          <div className="flex gap-2">
            <AspectRatio ratio={1 / 1} className="size-16">
              <Image src={"/school_logo.png"} alt={""} fill />
            </AspectRatio>
            <span className="font-medium flex items-center gap-1 font-garamond">
              Manny So Christian Academy.
            </span>
          </div>
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
    <div className="lg:p-20 p-20 bg-secondary flex-col flex gap-10">
      <h1 className="text-[clamp(1rem,4vw,10rem)] font-garamond text-center">
        What sets us aparts?
      </h1>
      <div className="flex flex-col lg:gap-40 gap-10">
        <div className="lg:grid-cols-2 lg:grid">
          <AspectRatio ratio={16 / 9} className="z-10 lg:block hidden">
            <Image src={"/holistic.jpg"} alt="Holistic Images" fill />
          </AspectRatio>
          <Card className="shadow-2xl pt-0 rounded-none  relative lg:top-20 lg:-left-20">
            <AspectRatio ratio={9 / 4} className="z-10 block lg:hidden">
              <Image src={"/holistic.jpg"} alt="Holistic Images" fill />
            </AspectRatio>
            <div className="lg:pt-20 lg:pb-20 lg:pr-5 lg:pl-30 p-10 flex flex-col gap-2">
              <h1 className="text-3xl font-garamond font-bold text-primary">
                Learner-Centered
              </h1>
              <p className="text-base">
                At Manny So Christian Academy, students have the space and
                encouragement to take control of their own learning journey. Our
                teacher-guides cultivate an environment that nurtures
                independence and curiosity. With ample time, space, and support,
                students are empowered to pursue authentic interests.
              </p>
            </div>
          </Card>
        </div>
        <div className="lg:grid-cols-2 lg:grid">
          <Card className="shadow-2xl pt-0 rounded-none  relative lg:top-20">
            <AspectRatio ratio={9 / 4} className="z-10 block lg:hidden">
              <Image src={"/diversity.jpg"} alt="Holistic Images" fill />
            </AspectRatio>
            <div className="lg:pt-20 lg:pb-20 lg:pr-30 lg:pl-10 p-10 flex flex-col gap-2">
              <h1 className="text-3xl font-garamond font-bold text-primary">
                Active Learning
              </h1>
              <p className="text-base">
                Learning happens through active engagement, and communication
                and collaboration are essential skills for success. We dedicate
                roughly half of each student's experience to collaborative
                discussions, problem-solving, and real-world applications. The
                other half focuses on developing fluency in essential skills and
                content, all at a pace that suits the individual learner.
              </p>
            </div>
          </Card>
          <AspectRatio
            ratio={16 / 9}
            className="z-10 lg:block hidden lg:-left-20"
          >
            <Image src={"/diversity.jpg"} alt="Holistic Images" fill />
          </AspectRatio>
        </div>

        <div className="lg:grid-cols-2 lg:grid">
          <AspectRatio ratio={16 / 9} className="z-10 lg:block hidden">
            <Image src={"/culture.png"} alt="Holistic Images" fill />
          </AspectRatio>
          <Card className="shadow-2xl pt-0 rounded-none  relative lg:top-20 lg:-left-20">
            <AspectRatio ratio={9 / 4} className="z-10 block lg:hidden">
              <Image src={"/culture.png"} alt="Holistic Images" fill />
            </AspectRatio>
            <div className="lg:pt-20 lg:pb-20 lg:pr-5 lg:pl-30 p-10 flex flex-col gap-2">
              <h1 className="text-3xl font-garamond font-bold text-primary">
                Flexible & Accelerated Pacing
              </h1>
              <p className="text-base">
                Mastery of skills and content knowledge matters more than seat
                time. Freed from traditional pacing, our students often
                accelerate their learning by 1.5-2 grade levels per year and
                tackle grade-school work for their future academic success.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-20">
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
          {/* <div className="flex-1">
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
          </div> */}
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
