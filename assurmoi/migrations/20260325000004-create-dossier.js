"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Dossiers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dossier_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      claim_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: "Claims",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tracking_officer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      scenario: {
        type: Sequelize.ENUM("NotDefined", "RepairableVehicle", "WreckedVehicle"),
        defaultValue: "NotDefined",
      },
      current_step: {
        type: Sequelize.ENUM(
          "Initialized",
          "ExpertiseRequestPending",
          "ExpertiseScheduled",
          "ExpertiseCompleted"
        ),
        defaultValue: "Initialized",
        allowNull: false,
      },
      date_intervention_planifiee: Sequelize.DATEONLY,
      date_prise_en_charge_planifiee: Sequelize.DATE,
      date_prise_en_charge_effective: Sequelize.DATE,
      date_debut_intervention: Sequelize.DATE,
      date_fin_intervention: Sequelize.DATEONLY,
      date_restitution_planifiee: Sequelize.DATEONLY,
      date_restitution_effective: Sequelize.DATEONLY,
      date_reception_facture: Sequelize.DATEONLY,
      date_reglement: Sequelize.DATEONLY,
      montant_estimation_indemnisation: Sequelize.DECIMAL(10, 2),
      approbation_client: Sequelize.BOOLEAN,
      date_previsionnelle_prise_en_charge: Sequelize.DATEONLY,
      date_indemnisation: Sequelize.DATEONLY,
      facture_reglee_assurance_tiers: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      closure_date: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Dossiers");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Dossiers_scenario";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Dossiers_current_step";');
  },
};
