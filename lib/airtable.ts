import Airtable from 'airtable'

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_KEY || '');

const table = base("coffee-stores");

const getMinifiedRecord = (record:any) =>{
    return {
        recordId:record.id,
        ...record.fields
    };
}

const getMinifiedRecords = (records :any) => {
    return records.map((record:any) => getMinifiedRecord(record));
};

const findRecordByFilter =  async (id:any) => {
    const findCoffeeStoreRecords = await table.select({
        filterByFormula: `id="${id}"`
    }).firstPage();
    
    return getMinifiedRecords(findCoffeeStoreRecords)

}

const upVoteRecordById = async (id:any,voting:any) => {
    return await table.update([
        {
            id:id,
            fields:{
                voting
            }
        }
    ])
}

export {table,getMinifiedRecords,findRecordByFilter, upVoteRecordById};