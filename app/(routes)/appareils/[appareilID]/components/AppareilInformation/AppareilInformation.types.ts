export type User = {
    id : number 
    firstName : string
    lastName : string
    email : string 
    role : string
}

export type Voiture = {
    id : number 
    nom : string
    marque : string
    modele : string
    immatricule : string
    user : User
}

export type AppareilInformationProps = {
    appareil : Appareil
}




export type Appareil = {
    id : number 
    name : string 
    description : string
    actif : boolean
    serverType : string 
    imei : string
    simNumber1 : string
    simNumber2 : string
    smsEmail : string
    vitesseMax : number
    idConducteur : number
    nomConducteur:string
    prenomConducteur:string
    email_Conducteur:string
    idCompany : number
    VoitureNom:string
    Voituremarque:string
    Voituremodele:string
    Voitureimmatricule:string
    speedAlertEnabled : boolean,
    fuelAlertEnabled : boolean,
    hoodOpenAlertEnabled : boolean,
    deviceConnected : boolean,

    insuranceExpiryDate : Date,
    oilChangeDate : Date,
    vignetteDeadline : Date
}