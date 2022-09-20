import { NextApiRequest, NextApiResponse } from 'next';
import { findRecordByFilter, getMinifiedRecords, table } from '../../lib/airtable';

const createCoffeeStore =  async (  
    req: NextApiRequest,
    res: NextApiResponse<any>
) => {

    try{
        if(req.method === "POST") {

            const {id ,name ,voting ,imgUrl } = req.body;
            //Check if an id exists
            if(!id){
                res.json({message:"no id provided"})
                return
            }
            
            //find a record
            const records = await findRecordByFilter(id);
            if(records.length !== 0) {
                res.json(records);
            } else {
                //create a record
                if(name) {
                    const createRecords = await table.create([
                         {
                             fields:{
                                 id,
                                 name,
                                 imgUrl,
                                 voting,
                             }
                         }
                     ])
                     const records = getMinifiedRecords(createRecords)
                     res.json(records)
                } else {
                    res.status(422).json({message: 'name is missing'})
                }
            }

        } 
    } catch (error:any) {
        console.error("Error finding or creating store", error)
        res.status(500).json({message:"Error finding or creating store", error})
    }

}

export default createCoffeeStore;