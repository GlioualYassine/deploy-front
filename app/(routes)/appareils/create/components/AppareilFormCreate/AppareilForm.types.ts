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
}



export type Appareil = {
    id : number 
    nom : string 
    description : string
    actif : string
    server : string 
    imei : string
    sim1 : string
    sim2 : string
    smsEmail : string
    vitesseMax : number
    voitureId : number
}