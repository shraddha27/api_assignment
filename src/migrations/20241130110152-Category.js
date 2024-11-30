'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Categories', 
    {
      categoryId: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    }
    ,
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true

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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Categories');
  }
};
