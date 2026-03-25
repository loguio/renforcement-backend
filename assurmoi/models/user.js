const { Model, DataTypes } = require("sequelize");

const User = (dbInstance) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      two_step_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM(
          "Admin",
          "PortfolioManager",
          "TrackingOfficer",
          "CustomerCare",
          "Insured"
        ),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Utilisé pour authentification 2FA SMS",
      },
    },
    {
      sequelize: dbInstance,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return User;
};

module.exports = User;
