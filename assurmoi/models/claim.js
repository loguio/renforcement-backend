const { Model, DataTypes } = require("sequelize");

const Claim = (dbInstance) => {
  class Claim extends Model {
    static associate(models) {
      Claim.belongsTo(models.Insured, { foreignKey: "insured_id", as: "insured" });
      Claim.belongsTo(models.User, { foreignKey: "creator_id", as: "creator" });
      Claim.hasMany(models.Document, { foreignKey: "claim_id", as: "documents" });
      Claim.hasOne(models.Dossier, { foreignKey: "claim_id", as: "dossier" });
    }
  }

  Claim.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      insured_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Chargé de clientèle ayant initié le sinistre",
      },
      vehicle_registration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driver_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driver_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driver_is_insured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      call_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      claim_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      responsibility_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "0, 50, ou 100",
      },
      manager_validation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM("Draft", "PendingValidation", "Validated", "Rejected"),
        defaultValue: "Draft",
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize: dbInstance,
      modelName: "Claim",
      tableName: "Claims",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Claim;
};

module.exports = Claim;
