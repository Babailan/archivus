const z = require("zod");

const data = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    age: z.number().min(1, { message: "Age is required" }),
    subjects: z.array(z.string()).min(1, { message: "Subjects are required" }),
  })
  .parse({
    name: "John",
    age: 20,
    subjects: ["Math", "Science"],
    test: "tedawdwast",
  });

console.log(data);
