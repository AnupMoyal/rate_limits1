import express from "express";
import router from "./routes/dataroutes.js";

const app = express();

app.set("trust proxy", true);
app.use("/", router);


app.get("/",(req,res)=>{
    res.send("rate limiter running ...");

});

const PORT =3000;
app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
})