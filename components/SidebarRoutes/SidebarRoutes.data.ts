import {
    BarChart,
    Building2,
    PanelsTopLeft,
    Settings,
    ShieldCheck,
    CircleHelpIcon,
    Car ,
    BarChart4,
    Users,
    Fuel ,
    MapPinned ,
    ChartNoAxesCombined ,
    BookUser ,
    Bell ,
    SmartphoneNfc 
} from "lucide-react"
//import { GrGroup } from "react-icons/gr";
import { CircleDollarSign } from 'lucide-react';


export const dataGeneralSidebar = [
    {
        icon : PanelsTopLeft ,
        label : "Dashboard",
        href : "/",
    },
    {
        icon : Building2 ,
        label : "Companies",
        href : "/companies",
    },
    {
        icon : Car  ,
        label : "Automobiles",
        href : "/automobiles",
    },
    {
        icon : Users   ,
        label : "Clients",
        href : "/clients",
    },
    {
        icon : SmartphoneNfc    ,
        label : "Appareils",
        href : "/appareils",
    },
]

export const dataToolsSidebar = [
    {
        icon : Fuel  ,
        label : "Fuel",
        href : "/fuel",
    },
    {
        icon : MapPinned  ,
        label : "Tracking",
        href : "/tracking",
    },
    {
        icon : CircleDollarSign  ,
        label : "Paiements",
        href : "/paiement",
    },
    {
        icon : ChartNoAxesCombined  ,
        label : "Rapports",
        href : "/rapports",
    },
    {
        icon : Bell   ,
        label : "Notifications",
        href : "/notifications",
    },
]

export const dataSupportSidebar = [
    {
        icon : Settings ,
        label : "Setting",
        href : "/setting",
    },
    {
        icon : ShieldCheck ,
        label : "Security",
        href : "/security",
    }
    
]
