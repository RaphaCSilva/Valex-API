import express, {json} from "express";
import "express-async-errors";
import dotenv from "dotenv";
import router from "./routes/index.js"
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

dotenv.config();
const app = express();
app.use(json());
app.use(router);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server de pé na porta ${PORT}`);
})