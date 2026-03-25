const { Model, DataTypes } = require("sequelize");

const Document = (dbInstance) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.Claim, { foreignKey: "claim_id", as: "claim" });
      Document.belongsTo(models.Dossier, { foreignKey: "dossier_id", as: "dossier" });
    }
  }

  Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      claim_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dossier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM(
          "InsuranceCertificate",
          "RegistrationCertificate",
          "IdentityDocument",
          "Invoice",
          "BankDetails",
          "Other"
        ),
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      validated_by_manager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      upload_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize: dbInstance,
      modelName: "Document",
      tableName: "Documents",
      timestamps: true,
      createdAt: "upload_date",
      updatedAt: false,
    }
  );

  return Document;
};

module.exports = Document;
