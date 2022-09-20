import { NextApiRequest, NextApiResponse } from "next";
import { findRecordByFilter, upVoteRecordById, table, getMinifiedRecords } from "../../lib/airtable";

const upVoteCoffeeStoreById = async (
    req: NextApiRequest,
    res: NextApiResponse<any> 
) => {
    
    if (req.method === "PUT") {
        
        try {
            const {id} = req.body;

            if(!id) {
                res.status(400).json({message:"Id not provided"})
                return
            }
    
            const records = await findRecordByFilter(id);
            
            if(records.length !== 0) {

                const record = records[0];

                const calculateVoting = +record.voting + 1;
                
                const updatedRecord = await upVoteRecordById(record.recordId,calculateVoting);

                if(updatedRecord) {
                    const minifiedRecords = getMinifiedRecords(updatedRecord)
                    res.json(minifiedRecords)
                }

            } else {
                res.json({message: "Coffee store id doesn´t exist",id})
            }
        } catch (error) {
            res.status(500).json({message:"Error upvoting coffee store",error})
        }
    }

}

export default upVoteCoffeeStoreById;