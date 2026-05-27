import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function TuitionAffordabilityPage() {
  return (
    <div>
      <AspectRatio ratio={16 / 3} className="w-full">
        <Image src="/faqs.jpg" fill objectFit="cover" alt=""></Image>
      </AspectRatio>
      <div className="max-w-5xl bg-primary m-auto text-center px-20 py-10">
        <h1 className="text-4xl font-bold text-white">
          Tuition and Affordability
        </h1>
      </div>

      <div>
        <Card>
          <CardHeader>
            <h1></h1>
          </CardHeader>
        </Card>
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
