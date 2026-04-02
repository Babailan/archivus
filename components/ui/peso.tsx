import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { PhilippinePeso } from "lucide-react";

export const PesoInput = ({
  children,
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
