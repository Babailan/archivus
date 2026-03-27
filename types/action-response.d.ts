interface FieldError {
  field: string;
  message: string;
}

interface ActionResponse {
  message: string;
  success: boolean; // Usually false in this context
  errors?: FieldError[];
}