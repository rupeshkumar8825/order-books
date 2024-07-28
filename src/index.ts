import { Request, Response } from "express";
import express from 'express'
import { OrderInputSchema } from "./types";
// const express = require("express");

const app = express();

// defining the port to run this server on some of specific projects for this purpose 
const PORT = 3000;


//middlewares section comes here 
app.use(express.json());


// defining a single route for this purpose 
app.post("/api/v1/order", (request : Request, response : Response) => {
    const requestedOrder = request.body;
    const parsedRequestedOrder = OrderInputSchema.safeParse(requestedOrder);

    if(!parsedRequestedOrder.success)
    {
        // error happened while validating the schema 
        // this means that the requested data was not in proper format hence we 
        // have to return the validation errors that we have got to the user as response 
        response.status(400).send(parsedRequestedOrder.error.message);
    }

    // this means that the data was correct and we have to proceed here with proper logic
    console.log("the user has sent the request with proper format, The value is as follows\n", parsedRequestedOrder);
    console.log("the user has hit this end point in order to get some response");

    const jsonResponse = {
        message : "succcess"
    }

    // say everything went fine 
    response.status(200).json(jsonResponse);
})


// defining the server to listen to this particular port for this purpose 
app.listen(PORT, () =>{
    console.log(`The server is up and running on the port ${PORT}`);
})