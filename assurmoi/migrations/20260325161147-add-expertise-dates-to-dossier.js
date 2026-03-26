'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Dossiers', 'date_expertise_planifiee', {
      type: Sequelize.DATEONLY,
    });
    await queryInterface.addColumn('Dossiers', 'date_expertise_effective', {
      type: Sequelize.DATEONLY,
    });
    await queryInterface.addColumn('Dossiers', 'date_retour_expertise', {
      type: Sequelize.DATEONLY,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Dossiers', 'date_expertise_planifiee');
    await queryInterface.removeColumn('Dossiers', 'date_expertise_effective');
    await queryInterface.removeColumn('Dossiers', 'date_retour_expertise');
  }
};
