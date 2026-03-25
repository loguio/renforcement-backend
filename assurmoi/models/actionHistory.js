const { Model, DataTypes } = require("sequelize");

const ActionHistory = (dbInstance) => {
  class ActionHistory extends Model {
    static associate(models) {
      ActionHistory.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      ActionHistory.belongsTo(models.Claim, { foreignKey: "claim_id", as: "claim" });
      ActionHistory.belongsTo(models.Dossier, { foreignKey: "dossier_id", as: "dossier" });
    }
  }

  ActionHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      claim_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dossier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize: dbInstance,
      modelName: "ActionHistory",
      tableName: "ActionHistories",
      timestamps: true,
      createdAt: "timestamp",
      updatedAt: false,
    }
  );

  return ActionHistory;
};

module.exports = ActionHistory;
