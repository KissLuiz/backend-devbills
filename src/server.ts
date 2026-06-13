import app from "./app.js";
import { env } from "./config/env.js";
import initializeFirebaseAdmin from "./config/firebase.js";
import { PrismaConnect } from "./config/prisma.js";
import { initializeGlobalCategories } from "./services/globalCategories.service.js";

const PORT = env.PORT;

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await PrismaConnect();
    await initializeGlobalCategories();

    await app
      .listen({ port: Number(process.env.PORT || PORT), host: "0.0.0.0" })
      .then(() => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

startServer();
