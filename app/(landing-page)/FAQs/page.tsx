import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, Circle } from "lucide-react";
import Image from "next/image";

export default function FAQsPage() {
  return (
    <div>
      <AspectRatio ratio={16 / 3} className="w-full">
        <Image src="/faqs.jpg" fill objectFit="cover" alt=""></Image>
      </AspectRatio>
      <div className="max-w-5xl bg-primary m-auto text-center px-20 py-10">
        <h1 className="text-4xl font-bold text-white">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="mt-5 gap-5 *:mt-2">
        {/* Question 1: About the Academy */}
        <Collapsible className="rounded-md max-w-lg m-auto">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size={"lg"}
                className="w-full bg-primary! text-secondary! p-5"
              >
                <Circle className="size-2 mr-2" />
                What is Manny So Christian Academy?
                <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm mt-2">
            <p>
              Manny So Christian Academy is a Christ-centered learning community
              dedicated to academic excellence, character development, and
              spiritual growth. We offer a supportive environment where students
              are challenged to reach their full potential intellectually and
              morally.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Question 2: Academic Growth */}
        <Collapsible className="rounded-md max-w-lg m-auto">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size={"lg"}
                className="w-full bg-primary! text-secondary! p-5"
              >
                <Circle className="size-2 mr-2" />
                What does academic growth look like at Manny So Christian
                Academy?
                <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm mt-2">
            <p>
              Flexible, Accelerated Pacing: Our students typically master more
              than one grade level annually, with many progressing through 1.5-2
              grade levels each year. This accelerated pace allows for rapid
              academic growth and advanced learning opportunities.
            </p>
            <p>
              High Academic Achievement and Growth: On standardized tests like
              MAP and PSAT/SAT, our median students consistently score between
              the 95th and 99th percentiles, demonstrating strong year-over-year
              improvement. Students starting at lower achievement levels quickly
              catch up.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Question 3: Curriculum & Values */}
        <Collapsible className="rounded-md max-w-lg m-auto">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size={"lg"}
                className="w-full bg-primary! text-secondary! p-5"
              >
                <Circle className="size-2 mr-2" />
                How are Christian values integrated into the daily curriculum?
                <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm mt-2">
            <p>
              Faith integration happens naturally across all subjects, not just
              in Bible class. We weave biblical principles, ethical reasoning,
              and character development lessons into history, science,
              literature, and daily student life.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Question 4: Class Sizes */}
        <Collapsible className="rounded-md max-w-lg m-auto">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size={"lg"}
                className="w-full bg-primary! text-secondary! p-5"
              >
                <Circle className="size-2 mr-2" />
                What is the average class size and student-to-teacher ratio?
                <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm mt-2">
            <p>
              To ensure personalized attention and deep mentorship, we maintain
              an average class size of 15 to 18 students, with an overall
              student-to-teacher ratio of 12:1. This lets our faculty understand
              how each individual child learns best.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Question 5: Extracurriculars */}
        <Collapsible className="rounded-md max-w-lg m-auto">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size={"lg"}
                className="w-full bg-primary! text-secondary! p-5"
              >
                <Circle className="size-2 mr-2" />
                What extracurricular activities and sports are available?
                <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm mt-2">
            <p>
              We believe in holistic education and offer a variety of programs
              outside the classroom. Students can participate in competitive
              athletics (basketball, volleyball, soccer, and track), performing
              arts, student council, robotics, and community service clubs.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Question 6: Enrollment Process (Updated) */}
        <Collapsible className="rounded-md max-w-lg m-auto">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size={"lg"}
                className="w-full bg-primary! text-secondary! p-5"
              >
                <Circle className="size-2 mr-2" />
                What is the enrollment procedure for new and returning students?
                <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm mt-2">
            <p>
              <strong>For Returning (Old) Students:</strong> There is no need to
              submit an application online. You may proceed directly to the
              school registrar&apos;s office to secure and fill out your
              enrollment form.
            </p>
            <p>
              <strong>For New Enrollees:</strong> You have two options to apply.
              You can either conveniently submit your application online through
              our admissions portal, or visit the campus physically to process
              your registration in person.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="m-auto text-center mt-10 text-3xl">
        <h1>
          More questions about us? You can contact us at{" "}
          <a
            href="mailto:info@mannysochristian.org"
            className="text-blue-500 underline"
          >
            info@mannysochristian.org
          </a>
        </h1>
      </div>
    </div>
  );
}
