import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingPageNavbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}

const LandingPageNavbar = () => {
  return (
    <div className="flex border-b justify-between items-center p-5 lg:px-20 top-0 bg-background z-20 sticky shadow-2xl">
      <div>
        <Link href={"/"}>
          <div className="flex gap-2">
            <AspectRatio ratio={1 / 1} className="size-10">
              <Image src={"/school_logo.png"} alt={""} fill />
            </AspectRatio>
            <span className="font-medium flex items-center gap-1 font-garamond text-sm lg:text-2xl">
              Manny So Christian Academy.
            </span>
          </div>
        </Link>
      </div>
      <div className="gap-10 hidden lg:flex">
        <HoverCard>
          <HoverCardTrigger
            delay={0}
            render={
              <Link
                href={"/about-us"}
                className="hover:text-primary transition-colors"
              >
                About
              </Link>
            }
          ></HoverCardTrigger>
          <HoverCardContent className="rounded-none text-balance text-sm p-5">
            <div className="flex flex-col gap-5">
              <Link href="/">Contact</Link>
              <Link href="/about-us#mission">Mission & Philosophy</Link>
              <Link href="/FAQs">Frequently Asked Questions</Link>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger
            delay={0}
            render={
              <Link
                href={"/about-us"}
                className="hover:text-primary transition-colors"
              >
                Admissions
              </Link>
            }
          ></HoverCardTrigger>
          <HoverCardContent className="rounded-none text-balance text-sm p-5">
            <div className="flex flex-col gap-5">
              <Link href="/">Apply</Link>
              <Link href="/about-us#mission">Tuition & Affordability</Link>
            </div>
          </HoverCardContent>
        </HoverCard>
        <Link
          href={"https://maps.app.goo.gl/o1XbgPkZmbsWzu3r9"}
          target="_blank"
          className="hover:text-primary transition-colors"
        >
          Visit Us
        </Link>
        <Link
          href={"/enroll"}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Apply
        </Link>
      </div>
      <div className="lg:hidden">
        <Drawer direction="right">
          <DrawerTrigger>
            <div className="flex gap-2">
              <Menu strokeWidth={1} />
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                <Link href={"/"}>
                  <div className="flex gap-2">
                    <AspectRatio ratio={1 / 1} className="size-10">
                      <Image src={"/school_logo.png"} alt={""} fill />
                    </AspectRatio>
                    <span className="font-medium flex items-center gap-1 font-garamond text-sm lg:text-2xl">
                      Manny So Christian Academy.
                    </span>
                  </div>
                </Link>
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col p-5 *:text-base gap-5">
              <Link href={"/about-us"}>About Us</Link>
              <Link
                href={"https://maps.app.goo.gl/o1XbgPkZmbsWzu3r9"}
                target="_blank"
              >
                Visit Us
              </Link>
              <Link href={"/enroll"} className="text-primary">
                Apply
              </Link>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

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
                <a
                  href="/about-us"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/MSCA2015/"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@mannysochristianacademy9166"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  Youtube
                </a>
              </li>
            </ul>
          </div>
        </div>

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
