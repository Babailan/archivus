import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PhilippinePeso } from "lucide-react";

export const PesoInput = ({
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <InputGroup>
      <InputGroupInput placeholder="" {...props} />
      <InputGroupAddon>
        <PhilippinePeso />
      </InputGroupAddon>
    </InputGroup>
  );
};
