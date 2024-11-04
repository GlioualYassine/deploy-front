export type User = {
     id : number 
     firstname : string
     lastname : string
     email : string 
     companyId : number
     role : string
}



export type Device = {
    id : number,
    imei : string,
    nom : string,
    serverType : string,
    description : string,
    actif : boolean,
    simNumber1 : string,
    simNumber2 : string,
    smsEmail : string,
    vitesseMax : number,
    VoitureNom : string,
    Voituremarque : string,
    Voitureimmatricule : string,
    userId : number,
    speedAlertEnabled : boolean,
    fuelAlertEnabled : boolean,
    hoodOpenAlertEnabled : boolean,

    insuranceExpiryDate : Date,
    oilChangeDate : Date,
    vignetteDeadline : Date

}