const { Model, DataTypes } = require("sequelize");

const Insured = (dbInstance) => {
  class Insured extends Model {
    static associate(models) {
      Insured.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Insured.hasMany(models.Claim, { foreignKey: "insured_id", as: "claims" });
    }
  }

  Insured.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: dbInstance,
      modelName: "Insured",
      tableName: "Insureds",
      timestamps: false,
    }
  );

  return Insured;
};

module.exports = Insured;
