import { response } from "express"

// defining the interfaces related to the order books here for this purpose 
export interface Order{
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
    bids : {[price : number] : number}, 
    asks : {[price : number] : number}
}

export interface Fill {
    price : number, 
    qty : number, 
    tradeId : number
}

// defining the constants for initializing the values 
export const orderBook : OrderBook = {
    bids : [], 
    asks : [], 
}


// this will store the final order book after combining all the orderBook. 
// in other words this is the simplified version of orderbooks which will store the 
// final mapping of the bids and asks with the price and its quantity to be met in this case
export const bookWithQuantity : BookWithQuantity = {
    bids : {}, 
    asks : {}
}


export let GLOBAL_TRADE_ID = 0;

// defining the functions in order to perform some of the functions here 
export const FillOrderBooks = (currentOrderDetails : any, orderId : string) => 
{
    console.log("[FillOrderBooks]- Inside this function")
    let fills : Fill[] = [];
    let quantity : number = currentOrderDetails.quantity;
    let price : number = currentOrderDetails.price;
    const maxFillQuantity = getFillAmount(currentOrderDetails.price, currentOrderDetails.quantity, currentOrderDetails.side)
    let executedQty = 0;

    if(currentOrderDetails.type === 'ioc' && maxFillQuantity < currentOrderDetails.quantity)
    {
        return {status : "rejected", executedQty : maxFillQuantity, fills : []};
    }

    if(currentOrderDetails.side === "buy")
    {
        // here we have to sort the orderbooks 
        orderBook.asks.sort();
        orderBook.asks.forEach(o => {
            if (o.price <= price && quantity > 0) {
                console.log("filling ask");
                const filledQuantity = Math.min(quantity, o.quantity);
                console.log(filledQuantity);
                o.quantity -= filledQuantity;
                bookWithQuantity.asks[o.price] = (bookWithQuantity.asks[o.price] || 0) - filledQuantity;
                fills.push({
                    price: o.price,
                    qty: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID++
                });
                executedQty += filledQuantity;
                quantity -= filledQuantity;
                if (o.quantity === 0) {
                    orderBook.asks.splice(orderBook.asks.indexOf(o), 1);
                }
                if (bookWithQuantity.asks[price] === 0) {
                    delete bookWithQuantity.asks[price];
                }
            }
        })

        // Place on the book if order not filled
        if (quantity !== 0) {
            orderBook.bids.push({
                price,
                quantity: quantity - executedQty,
                side: 'bid',
                orderId : orderId
            });
            bookWithQuantity.bids[price] = (bookWithQuantity.bids[price] || 0) + (quantity - executedQty);
        }
    }
    else if(currentOrderDetails.sell === "sell")
    {
        orderBook.bids.forEach(o => {
            if (o.price >= price && quantity > 0) {
                const filledQuantity = Math.min(quantity, o.quantity);
                o.quantity -= filledQuantity;
                bookWithQuantity.bids[price] = (bookWithQuantity.bids[price] || 0) - filledQuantity;
                fills.push({
                    price: o.price,
                    qty: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID++
                });
                executedQty += filledQuantity;
                quantity -= filledQuantity;
                if (o.quantity === 0) {
                    orderBook.bids.splice(orderBook.bids.indexOf(o), 1);
                }
                if (bookWithQuantity.bids[price] === 0) {
                    delete bookWithQuantity.bids[price];
                }
            }
        });

        // Place on the book if order not filled
        if (quantity !== 0) {
            orderBook.asks.push({
                price,
                quantity: quantity,
                side: 'ask',
                orderId
            });
            bookWithQuantity.asks[price] = (bookWithQuantity.asks[price] || 0) + (quantity);
        }
    }


    // printing here the order book and bookWithQuantity
    // say everything went fine 
    return {
        status : "accepted", 
        executedQty, 
        fills
    }
}


const getFillAmount = (price : number, quantity : number, side : "buy" | "sell") => {
    let filled = 0;
    if(side === 'buy')
    {
        // using the for loop here for this purpose 
        orderBook.asks.forEach((currAsk : Ask) => {
            if(currAsk.price < price)
            {
                filled = filled + Math.min(currAsk.quantity, quantity);
            }
        });
    }
    else if(side === 'sell')
    {
        orderBook.bids.forEach((currBid : Bid) => {
            if(currBid.price < price)
            {
                filled = filled + Math.min(currBid.quantity, quantity);
            }
        })
    }

    // say everything went fine 
    return filled;
}



// defining the function to get the random order id using some of the Math.random functions 
export const GetOrderId = () : string  => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return ""
}