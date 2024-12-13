import { de } from "date-fns/locale";
import { z } from "zod";

export const formSchema = z.object({
  // Informations de l'appareil
  idAppareil: z
    .string()
    .optional(),
  nomAppareil: z
    .string()
    .max(50, "Le nom de l'appareil ne doit pas dépasser 50 caractères."),
  descriptionAppareil: z
    .string()
    .max(255, "La description de l'appareil ne doit pas dépasser 255 caractères."),
  actifAppareil: z.boolean({
    required_error: "Le statut actif de l'appareil est requis.",
  }),
  serverAppareil: z
    .string()
    .min(6, "Le serveur de l'appareil doit contenir au moins 6 caractères."),
  imeiAppareil: z
    .string()
    .optional(),

  // Informations de la carte SIM
  sim1Appareil: z
    .string()
    .min(6, "La carte SIM1 de l'appareil doit contenir au moins 6 caractères.")
    .refine((val) => /^\d{6,15}$/.test(val), {
      message: "Le numéro de SIM1 doit contenir entre 6 et 15 chiffres.",
    }),
  sim2Appareil: z
    .string()
    .optional()
    .refine((val) => val === undefined || /^\d{0,15}$/.test(val), {
      message: "Le numéro de SIM2, s'il est fourni, doit contenir entre 6 et 15 chiffres.",
    }).optional(),
  smsEmailAppareil: z
    .string()
    .optional(),
  vitesseMaxAppareil: z
    .string()
    .optional(),

  // Champs supplémentaires pour l'appareil
  
  speedAlertEnabled: z.boolean({
    required_error: "Le statut d'alerte de vitesse est requis.",
  }),
  fuelAlertEnabled: z.boolean({
    required_error: "Le statut d'alerte de carburant est requis.",
  }),
  hoodOpenAlertEnabled: z.boolean({
    required_error: "Le statut d'alerte d'ouverture du capot est requis.",
  }),


  

  // Informations de la voiture
  nomVoiture: z
    .string()
    .max(50, "Le nom de la voiture ne doit pas dépasser 50 caractères.")
    .optional(),
  marqueVoiture: z
    .string()
    .optional(),
  modeleVoiture: z
    .string()
    .optional(),
  immatriculeVoiture: z
    .string()
    .max(50, "Le numéro d'immatriculation de la voiture ne doit pas dépasser 50 caractères.")
    .optional(),

  // Dates de maintenance
  insuranceExpiryDate: z
    .string()
    .optional()
    .refine((val) => {
      if (val) {
        const date = val ? new Date(val) : new Date();
        return !isNaN(date.getTime());
      }
      return false;
    }, {
      message: "La date d'expiration de l'assurance doit être une date valide.",
    }),
  oilChangeDate: z
    .string()
    .optional()
    .refine((val) => {
      const date = val ? new Date(val) : new Date();
      return !isNaN(date.getTime());
    }, {
      message: "La date de la prochaine vidange doit être une date valide.",
    }),
  vignetteDeadline: z
    .string()
    .optional()
    .refine((val) => {
      const date = val ? new Date(val) : new Date();
      return !isNaN(date.getTime());
    }, {
      message: "La date limite de la vignette doit être une date valide.",
    }),

  // Informations du conducteur
  idConducteur: z
    .string()
    .optional(),
  firstNameConducteur: z
    .string()
    .max(50, "Le prénom du conducteur ne doit pas dépasser 50 caractères.")
    .optional(),
  lastNameConducteur: z
    .string()
    .max(50, "Le nom de famille du conducteur ne doit pas dépasser 50 caractères.")
    .optional(),
  emailConducteur: z
    .string()
    .email("L'adresse e-mail du conducteur doit être valide.")
    .optional(),
    mdpConducteur: z
    .string()
    .min(8, "Le mot de passe du conducteur doit contenir au moins 8 caractères.")
    ,
  // Informations de la company 
  idCompany: z
    .string()
    .nullable(),
  
    deviceConnected: z.boolean({
    required_error: "Le statut de connexion de l'appareil est requis.",
  }),
});


/*
export const formSchema = z.object({
    idAppareil : z.number().int().positive().optional(),
    nomAppareil : z.string().min(2).max(50),
    descriptionAppareil : z.string().min(2),
    actifAppareil : z.boolean(),
    serverAppareil : z.string().min(6),
    imeiAppareil : z.string().min(6),
    sim1Appareil : z.string().min(6),
    sim2Appareil : z.string().optional(),
    smsEmailAppareil : z.string().min(6),
    vitesseMaxAppareil : z.number().int().positive(), 

    idConducteur : z.number().int().positive().optional(),
    firstNameConducteur : z.string().min(2).max(50),
    lastNameConducteur : z.string().min(2).max(50),
    emailConducteur : z.string().email(),

    idVoiture : z.number().int().positive().optional(),
    nomVoiture : z.string().min(2).max(50),
    marqueVoiture : z.string().min(6),
    modeleVoiture : z.string().min(6),
    immatriculeVoiture : z.string().min(6),

})*/
