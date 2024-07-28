import { Request, Response } from "express";

const express = require("express");

const app = express();

// defining the port to run this server on some of specific projects for this purpose 
const PORT = 3000;

// defining a single route for this purpose 
app.get("/api/v1/order", (request : Request, response : Response) => {

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