'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('Users', {
      email: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      }
      ,
      password: {
        type: Sequelize.STRING,
        allowNull: false

      },
      createdAt: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false
      }
      
  })},

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('Users');
  }
};
