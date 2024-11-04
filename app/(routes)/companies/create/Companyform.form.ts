import { count } from "console";
import { z } from "zod";

export const formSchema = z.object({
    name : z.string(),
    admin_first_name : z.string(),
    admin_last_name : z.string(),
    admin_email : z.string().email(),
    adress : z.string(),
    phone : z.string().min(6),
})