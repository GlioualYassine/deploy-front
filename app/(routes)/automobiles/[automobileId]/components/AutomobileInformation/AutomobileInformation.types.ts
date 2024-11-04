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

export type VoitureInformationProps = {
    voiture : Voiture
}