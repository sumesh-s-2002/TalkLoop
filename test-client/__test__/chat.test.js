import { io }  from "socket.io-client"

const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3NmQ0NDMyLTAzOTctNDM2OC1iOTRlLWYxMDkwMGJjYzc3ZCIsInVzZXJuYW1lIjoic3VtZXNocyIsImlhdCI6MTc1MzI3MzI0MiwiZXhwIjoxNzUzODc4MDQyfQ.gmEb6n7ytOkYbrpShGH-3RCzb8Uy95TYbYbomVheP0U";
const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiMjA2MjEwLTRmMDEtNGVlOS1hOTQyLTNmNTgyODdkNDRhNiIsInVzZXJuYW1lIjoic3VtZXNoX3MiLCJpYXQiOjE3NTMyNzM0MDksImV4cCI6MTc1Mzg3ODIwOX0.J7oPEtt9rCowawR3EMrUKXYceY9EKZY4695zJCxyV3o";
const user_1 = "e76d4432-0397-4368-b94e-f10900bcc77d";
const user_2 = "ab206210-4f01-4ee9-a942-3f58287d44a6";

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const client1 =  io("http://chat-gateway:5000", {
    path : '/api/chat/connect',
    auth : {token : token1},
    transports : ['websocket']
})

// const client2 =  io("http://chat-gateway:5000", {
//     path : '/api/chat/connect',
//     auth : {token : token2},
//     transports : ['websocket']
// })


client1.on("connect", ()=>{
    console.log("connected to the client1!");
});

// client2.on("connect", () => {
//     console.log("client2 is connected and sending message to user 1");
// })

await wait(100);

client1.emit("chat-message", {
        to: user_2,
        message: "Hello world"
})



// client2.on("chat-message", (data)=>{
//     console.log(data);
// })

client1.on("connect_error", (err)=>{
    console.error("connection error: client1", err.message);
})

// client2.on("connect_error", (err)=>{
//     console.log("connection error client2:", err.message);
// })




// client2.on("chat-message", ()=>{
//     console.log("received message!");
// })



