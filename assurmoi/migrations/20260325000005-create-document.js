"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Documents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      claim_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Claims",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      dossier_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Dossiers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: false,
      },
      validated_by_manager: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      upload_date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Documents");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Documents_type";');
  },
};
