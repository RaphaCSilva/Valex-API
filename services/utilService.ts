import { findByApiKey } from "../repositories/companyRepository.js";


export async function validateAPIkey(APIkey: string){
    const company = await findByApiKey(APIkey);
    if(!company){
        throw { type: "unauthorized" };
    }
}