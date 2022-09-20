import { NextApiRequest, NextApiResponse } from "next";
import { findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";

const getCoffeeStoreById = async (    
    req: NextApiRequest,
    res: NextApiResponse<any> 
) => {
    const {id} = req.query;

    //check if id exist)
    if(!id){
        res.status(400).json({message:"Id not provided"})
        return
    }

    try {   

        const records = await findRecordByFilter(id);
        
        if(records.length !== 0) {
            res.json(records);
        } else {
            res.json({message:"Id could not be found"})
        }

    } catch (error) {
        res.status(500).json({message:"Something went wrong", error})
    }
};

export default getCoffeeStoreById;