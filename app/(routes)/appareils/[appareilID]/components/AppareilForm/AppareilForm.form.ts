import { z } from "zod";

export const formSchema = z.object({
  idAppareil: z
    .number()
    .int("L'identifiant de l'appareil doit être un entier.")
    .positive("L'identifiant de l'appareil doit être un nombre positif.")
    .optional(),
  nomAppareil: z
    .string()
    .min(2, "Le nom de l'appareil doit contenir au moins 2 caractères.")
    .max(50, "Le nom de l'appareil ne doit pas dépasser 50 caractères."),
  descriptionAppareil: z
    .string()
    .min(2, "La description de l'appareil doit contenir au moins 2 caractères."),
  actifAppareil: z.boolean({
    required_error: "Le statut actif de l'appareil est requis.",
  }),
  serverAppareil: z
    .string()
    .min(6, "Le serveur de l'appareil doit contenir au moins 6 caractères."),
  imeiAppareil: z
    .string()
    .min(15, "L'IMEI de l'appareil doit contenir 15 caractères.")
    .max(15, "L'IMEI de l'appareil doit contenir 15 caractères."),

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
    .refine((val) => val === undefined || /^\d{6,15}$/.test(val), {
      message: "Le numéro de SIM2, s'il est fourni, doit contenir entre 6 et 15 chiffres.",
    }).nullable(),
  smsEmailAppareil: z
    .string()
    .email("L'adresse e-mail pour les SMS doit être valide.")
    .min(6, "L'adresse e-mail pour les SMS doit contenir au moins 6 caractères.").nullable(),

  vitesseMaxAppareil: z
    .number()
    .int("La vitesse maximale de l'appareil doit être un entier.")
    .positive("La vitesse maximale de l'appareil doit être un nombre positif.").nullable(),

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
  deviceConnected: z.boolean({
    required_error: "Le statut de connexion de l'appareil est requis.",
  }),


  

  // Informations de la voiture
  nomVoiture: z
    .string()
    .min(2, "Le nom de la voiture doit contenir au moins 2 caractères.")
    .max(50, "Le nom de la voiture ne doit pas dépasser 50 caractères.")
    .nullable(),
  marqueVoiture: z
    .string()
    .min(2, "La marque de la voiture doit contenir au moins 2 caractères.")
    .nullable(),
  modeleVoiture: z
    .string()
    .min(2, "Le modèle de la voiture doit contenir au moins 2 caractères.")
    .nullable(),
  immatriculeVoiture: z
    .string()
    .min(2, "Le numéro d'immatriculation de la voiture doit contenir au moins 2 caractères.")
    .max(50, "Le numéro d'immatriculation de la voiture ne doit pas dépasser 50 caractères.")
    .nullable(),

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
    .number()
    .int("L'identifiant du conducteur doit être un entier.")
    .positive("L'identifiant du conducteur doit être un nombre positif.")
    .nullable(),
  firstNameConducteur: z
    .string()
    .min(2, "Le prénom du conducteur doit contenir au moins 2 caractères.")
    .max(50, "Le prénom du conducteur ne doit pas dépasser 50 caractères."),
  lastNameConducteur: z
    .string()
    .min(2, "Le nom de famille du conducteur doit contenir au moins 2 caractères.")
    .max(50, "Le nom de famille du conducteur ne doit pas dépasser 50 caractères."),
  emailConducteur: z
    .string()
    .email("L'adresse e-mail du conducteur doit être valide.")
    .min(6, "L'adresse e-mail du conducteur doit contenir au moins 6 caractères."),

  // Informations de la company 
  idCompany: z
    .number()
    .positive("L'identifiant de la company doit être un nombre positif.")
    .nullable(),
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
