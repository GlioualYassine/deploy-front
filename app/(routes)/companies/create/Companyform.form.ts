import { count } from "console";
import { z } from "zod";

export const formSchema = z.object({
    name : z.string(),
    admin_first_name : z.string(),
    admin_last_name : z.string(),
    admin_email : z.string().email(),
    password : z.string().min(8),
    adress : z.string().optional(),
    phone : z.string().optional(),
})