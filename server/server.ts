// import dotenv from "dotenv";
// dotenv.config();
// import express, { Request, Response } from 'express';

// import cors from 'cors';
// //import { toNodeHandler } from 'better-auth/dist/integrations/node.mjs';
// import { toNodeHandler } from 'better-auth/node';
// import { auth } from './lib/auth.js';
// import userRouter from './routes/userRoutes.js';
// import projectRouter from './routes/projectRouts.js';
// import uploadRoutes from "./routes/uploadRoutes.js";
// import deployRoutes from "./routes/deploy.js";
// import { stripeWebhook } from "./controllers/stripeWebhook.js";

// console.log("🔥 SERVER FILE LOADED");
// const app = express();
// //const port = 3000;
// const port = process.env.PORT || 3000;



// // const corsOptions = {
  
// //     origin:process.env.TRUSTED_ORIGINS?.split(',') || [],
// //     credentials: true
     
// // };
// // app.use(cors(corsOptions));

// // app.use(cors({
// //   origin: "https://newrepo-ten-wheat.vercel.app",
// //   credentials: true
// // }));


// app.use(cors({
//   origin: "https://newrepo-ten-wheat.vercel.app",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));


// app.options("*", cors());

// app.all('/api/auth/*any', toNodeHandler(auth));

// app.post('/api/stripe',express.raw({type: 'application/json'}), stripeWebhook)


// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));
// app.use(express.json());
// app.use((req, res, next) => {
//     console.log("🔥 HIT:", req.method, req.url);
//   console.log("BODY:", req.body);
//   console.log("COOKIES:", req.headers.cookie);
//   next();
// });
// app.use((req, res, next) => {
//   console.log("🌍 GLOBAL HIT:", req.method, req.url);
//   next();
// });

// // app.all('/api/auth/*any', toNodeHandler(auth));


// app.get('/', (req: Request, res: Response) => {
//     res.send('Server is live with Neon!');
// });
// app.use('/api/user',userRouter);
// app.use('/api/project',projectRouter);
// app.use("/api", uploadRoutes);
// app.use("/api/deploy", deployRoutes);
// console.log("🚀 ABOUT TO LISTEN");
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });













import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

// auth
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

// routes
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRouts.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import deployRoutes from "./routes/deploy.js";

// stripe
import { stripeWebhook } from "./controllers/stripeWebhook.js";

console.log("🔥 SERVER FILE LOADED");

const app = express();
const port = process.env.PORT || 3000;

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: "https://newrepo-ten-wheat.vercel.app",
    credentials: true,
  })
);

/* ---------------- STRIPE WEBHOOK (IMPORTANT: before json) ---------------- */
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/* ---------------- BODY PARSERS ---------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---------------- LOGGING ---------------- */
app.use((req, res, next) => {
  console.log("🔥 HIT:", req.method, req.url);
  next();
});

/* ---------------- AUTH ---------------- */
app.all("/api/auth/*", toNodeHandler(auth));

/* ---------------- ROUTES ---------------- */
app.get("/", (req: Request, res: Response) => {
  res.send("Server is live with Neon!");
});

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api", uploadRoutes);
app.use("/api/deploy", deployRoutes);

/* ---------------- START SERVER ---------------- */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});