// defining the interfaces related to the order books here for this purpose 
interface Order{
    price : number, 
    quantity : number, 
    orderId : string
}


// we can do the interface inheritance in order to not repeat the same code again and again for this purpose 
interface Bid extends Order {
    side : 'bid'
}

interface Ask extends Order{
    side : "ask"
}


interface OrderBook{
    bids : Bid[], 
    asks : Ask[]
}

interface PriceToQuantityDictionary 
{
    price : number,
    quantity : number 
}


interface BookWithQuantity {
    bids : PriceToQuantityDictionary[], 
    asks : PriceToQuantityDictionary[]
}

// defining the constants for initializing the values 
export const orderBook : OrderBook = {
    bids : [], 
    asks : [], 
}


// this will store the final order book after combining all the orderbook. 
// in other words this is the simplified version of orderbooks which will store the 
// final mapping of the bids and asks with the price and its quantity to be met in this case
export const bookWithQuantity : BookWithQuantity = {
    bids : [], 
    asks : []
}