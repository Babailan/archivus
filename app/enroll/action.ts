export async function createApplicantAction(data: FormData) {
  const first_name = data.get("first_name") as string;
  const last_name = data.get("last_name") as string;
  const middle_name = data.get("middle_name") as string;
  const birthdate = data.get("birthdate") as string;

  if (!first_name || !last_name || !middle_name || !birthdate) {
    throw new Error("All fields are required.");
  }
}
