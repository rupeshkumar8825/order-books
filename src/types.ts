// this file is being used for the zod validation 
// since in order to validate whether the data that we are receiving in the request 
// is following the correct format or not we will have to validate the schema 
// so zod is for schema validation itself 
import z from "zod"

// the following validates the order input schema so that the user do not send any gibberish 
export const OrderInputSchema = z.object({
    baseAsset : z.string(), 
    quoteAsset : z.string(), 
    price : z.number(), 
    quantity : z.number(), 
    side : z.enum(['buy', 'sell']), 
    type : z.enum(['limit', 'market']),
    kind : z.enum(['ioc']).optional()
});
