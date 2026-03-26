const userRoutes = require("./users");
const insuredRoutes = require("./insured");
const claimRoutes = require("./claim");
const documentRoutes = require("./document");
const dossierRoutes = require("./dossier");
const actionHistoryRoutes = require("./actionHistory");
const authRoutes = require("./auth");
const { verifyToken } = require("../middlewares/auth");

function initRoutes(app) {
  app.use("/auth", authRoutes); // Public route
  
  app.use("/user", verifyToken, userRoutes);
  app.use("/insured", verifyToken, insuredRoutes);
  app.use("/claim", verifyToken, claimRoutes);
  app.use("/document", verifyToken, documentRoutes);
  app.use("/dossier", verifyToken, dossierRoutes);
  app.use("/action-history", verifyToken, actionHistoryRoutes);

  app.get(
    "/",
    (req, res, next) => {
      console.log("middleware Homepage");
      next();
    },
    (req, res, next) => {
      console.log("Controller Homepage");
      res.status(200).json({
        message: "Bienvenu sur la page d'accueil",
      });
    },
  );
}

module.exports = initRoutes;
