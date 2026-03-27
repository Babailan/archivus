import prisma from "@/app/libs/dbClient";


export async function addNewUser(formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role");

    if (!username   || !email || !password || !role) {
        return { error: "All fields are required" };
    }

    // prisma.user.create({
    //     data:{
    //         email,
    //         password,
    //         username,
    //         role:{
    //             createMany:{
    //                 data:role
    //             }
    //         }
    //     }
    // });     
}