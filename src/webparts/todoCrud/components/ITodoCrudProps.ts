import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITodoCrudProps {
    description: string;
    myContinent: string;
    numContinentsVisited: number; 
    context:WebPartContext;
}
