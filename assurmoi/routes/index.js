const userRoutes = require("./users");
const insuredRoutes = require("./insured");
const claimRoutes = require("./claim");
const documentRoutes = require("./document");
const dossierRoutes = require("./dossier");
const actionHistoryRoutes = require("./actionHistory");

function initRoutes(app) {
  app.use("/user", userRoutes);
  app.use("/insured", insuredRoutes);
  app.use("/claim", claimRoutes);
  app.use("/document", documentRoutes);
  app.use("/dossier", dossierRoutes);
  app.use("/action-history", actionHistoryRoutes);

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
