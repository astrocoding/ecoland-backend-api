import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Land from "./LandModel.js";
import Transactions from "./TransactionModel.js";

const { DataTypes } = Sequelize;

const History = db.define('history', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tanggal_transaksi: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    landId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_lahan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tanggal_expired: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    freezeTableName: true
});

Users.hasMany(History, { foreignKey: 'userId' });
History.belongsTo(Users, { foreignKey: 'userId' });

Transactions.hasOne(History, { foreignKey: 'transactionId' });
History.belongsTo(Transactions, { foreignKey: 'transactionId' });

Land.hasMany(History, { foreignKey: 'landId' });
History.belongsTo(Land, { foreignKey: 'landId' });

export default History;
