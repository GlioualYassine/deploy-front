export type User = {
  id: number;
  firstname: string;
  lastname: string;
  firstName?:string;
  lastName?:string;
  email: string;
  companyId: number;
  role: string;
};

export type Device = {
  id: string;
  imei: string;
  user? : User;
  nom: string;
  serverType: string;
  description: string;
  actif: boolean;
  simNumber1: string;
  simNumber2: string;
  smsEmail: string;
  vitesseMax: number;
  VoitureNom: string;
  Voitureimmatricule: string;
  userId: number;
  speedAlertEnabled: boolean;
  fuelAlertEnabled: boolean;
  hoodOpenAlertEnabled: boolean;
  
  insuranceExpiryDate: Date;
  oilChangeDate: Date;
  vignetteDeadline: Date;
  dateCreation: Date | string;
  deviceConnected: boolean | string;
  deviceDeactivationAlert: boolean | string;
  fuelLevel: number | string;
  immatricule: string | undefined;
  marque: string | undefined;
  modele: string | undefined;
};
