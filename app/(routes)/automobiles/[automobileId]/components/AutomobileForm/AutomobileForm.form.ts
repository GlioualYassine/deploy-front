import { z } from "zod";

export const formSchema = z.object({
  nom: z.string().min(2).max(50),
  model: z.string().min(2),
  marque: z.string().min(6),
  immatricule: z.string().min(6),
  conducteur: z.string().min(1),
  idConducteur: z.string().min(1),  
})