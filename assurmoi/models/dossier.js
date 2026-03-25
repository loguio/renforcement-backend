const { Model, DataTypes } = require("sequelize");

const Dossier = (dbInstance) => {
  class Dossier extends Model {
    static associate(models) {
      Dossier.belongsTo(models.Claim, { foreignKey: "claim_id", as: "claim" });
      Dossier.belongsTo(models.User, { foreignKey: "tracking_officer_id", as: "trackingOfficer" });
      Dossier.hasMany(models.Document, { foreignKey: "dossier_id", as: "documents" });
    }
  }

  Dossier.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dossier_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      claim_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      tracking_officer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      scenario: {
        type: DataTypes.ENUM("NotDefined", "RepairableVehicle", "WreckedVehicle"),
        defaultValue: "NotDefined",
      },
      current_step: {
        type: DataTypes.ENUM(
          "Initialized",
          "ExpertiseRequestPending",
          "ExpertiseScheduled",
          "ExpertiseCompleted"
        ),
        defaultValue: "Initialized",
        allowNull: false,
      },
      date_intervention_planifiee: DataTypes.DATEONLY,
      date_prise_en_charge_planifiee: DataTypes.DATE,
      date_prise_en_charge_effective: DataTypes.DATE,
      date_debut_intervention: DataTypes.DATE,
      date_fin_intervention: DataTypes.DATEONLY,
      date_restitution_planifiee: DataTypes.DATEONLY,
      date_restitution_effective: DataTypes.DATEONLY,
      date_reception_facture: DataTypes.DATEONLY,
      date_reglement: DataTypes.DATEONLY,
      montant_estimation_indemnisation: DataTypes.DECIMAL(10, 2),
      approbation_client: DataTypes.BOOLEAN,
      date_previsionnelle_prise_en_charge: DataTypes.DATEONLY,
      date_indemnisation: DataTypes.DATEONLY,
      facture_reglee_assurance_tiers: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      closure_date: DataTypes.DATE,
    },
    {
      sequelize: dbInstance,
      modelName: "Dossier",
      tableName: "Dossiers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Dossier;
};

module.exports = Dossier;
