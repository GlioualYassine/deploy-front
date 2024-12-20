import {z} from 'zod';

export const formSchema = z.object({
    id : z.number().int('L\'identifiant de l\'utilisateur doit être un entier.').positive('L\'identifiant de l\'utilisateur doit être un nombre positif.').optional(),
    firstName : z.string().min(2,'Le prénom de l\'utilisateur doit contenir au moins 2 caractères.').max(50,'Le prénom de l\'utilisateur ne doit pas dépasser 50 caractères.'),
    lastName : z.string().min(2,'Le nom de famille de l\'utilisateur doit contenir au moins 2 caractères.').max(50,'Le nom de famille de l\'utilisateur ne doit pas dépasser 50 caractères.'),
    email : z.string().email('L\'adresse e-mail de l\'utilisateur doit être valide.'),
    role : z.string().min(2,'Le rôle de l\'utilisateur doit contenir au moins 2 caractères.').max(50,'Le rôle de l\'utilisateur ne doit pas dépasser 50 caractères.'),
    companyId : z.string().optional(),
    companyName : z.string().min(2,'Le nom de l\'entreprise doit contenir au moins 2 caractères.').max(50,'Le nom de l\'entreprise ne doit pas dépasser 50 caractères.').nullable()
})