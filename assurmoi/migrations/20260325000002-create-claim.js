"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Claims", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      insured_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Insureds",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      vehicle_registration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_is_insured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      call_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      claim_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      responsibility_percentage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      manager_validation: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM("Draft", "PendingValidation", "Validated", "Rejected"),
        defaultValue: "Draft",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Claims");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Claims_status";');
  },
};
