const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id_db:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    id_api:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hp: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    attack: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    defense: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    speed: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  });
};