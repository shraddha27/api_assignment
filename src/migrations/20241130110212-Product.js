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

    await queryInterface.createTable('Products', {
      productId: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    }
    ,
    name: {
      type: Sequelize.STRING,
      allowNull: false

    },
    productImage: {
      type: Sequelize.STRING,
      allowNull: false

    },
    productPrice:{
      type: Sequelize.DECIMAL(10,2),
      allowNull: false
    },
    categoryId:{

      type: Sequelize.UUID,
      references: {
        model: "Categories",
        key: "categoryId"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true

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
    }})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Products');
  }
};
