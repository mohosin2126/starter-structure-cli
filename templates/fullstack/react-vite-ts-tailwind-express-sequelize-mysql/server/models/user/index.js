const bcrypt = require("bcryptjs");
const { DataTypes, Model } = require("sequelize");

const { sequelize } = require("../config/db");

class User extends Model {
  comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user"
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {
      async beforeCreate(user) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
);

module.exports = User;
