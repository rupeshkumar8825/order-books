import { Request, Response } from "express";
import express from 'express'
import { OrderInputSchema } from "./types";
import { bookWithQuantity, FillOrderBooks, Order, orderBook } from "./orderbook";
import { GetOrderId } from "./orderbook";

//defining the app from the express 
const app = express();

// defining the port to run this server on some of specific projects for this purpose 
const PORT = 3000;
const BASE_ASSET = 'BTC';
const QUOTE_ASSET = 'USD';

//middlewares section comes here 
app.use(express.json());




// defining a single route for this purpose 
app.post("/api/v1/order", (request : Request, response : Response) => {
    const requestedOrder = request.body;
    const parsedRequestedOrder = OrderInputSchema.safeParse(requestedOrder);
    if(!parsedRequestedOrder.success || !parsedRequestedOrder.data)
        {
            response.status(400).send(parsedRequestedOrder.error.message);
        }
    const finalData = parsedRequestedOrder.data;
    const { baseAsset, quoteAsset, price, quantity, side, kind } = finalData ?? {};   
    const orderId = GetOrderId()

    if(baseAsset !== BASE_ASSET  || quoteAsset !== QUOTE_ASSET)
    {
        response.status(400).send("Invalid base or quote asset");
    }

    const {executedQty, fills} = FillOrderBooks(finalData, orderId);


    console.log("The current orderbook and the bookwith quantity are as follows\n");
    console.log("ASKS");
    console.log(orderBook.asks);

    console.log("BIDS")
    console.log(orderBook.bids)

    console.log("the bids with quantity are as follows \n");
    console.log(bookWithQuantity);

    // say everything went fine 
    response.send({orderId, executedQty, fills});
})




// defining the server to listen to this particular port for this purpose 
app.listen(PORT, () =>{
    console.log(`The server is up and running on the port ${PORT}`);
})