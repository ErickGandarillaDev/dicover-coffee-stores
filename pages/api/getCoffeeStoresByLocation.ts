// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCoffeeStores } from '../../lib/coffee-stores';

type Data = {
  message: string
}

const getCoffeeStoresByLocation = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {

    try {
        const {latLong, limit} = req.query;
    
        if(typeof latLong === "string" && typeof limit === "string") {
            const response = await fetchCoffeeStores(latLong,limit);
            res.status(200).json(response)
        }
    } catch (error:any) {
        console.error("There is an error",error)
        res.status(500).json({message:  error.message})
    }

}

export default getCoffeeStoresByLocation