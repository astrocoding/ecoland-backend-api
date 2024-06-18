import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Land from "./LandModel.js"; // Pastikan Land diimpor jika ada relasi

const { DataTypes } = Sequelize;

const Transactions = db.define('transactions', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tanggal_transaksi: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            notEmpty: true
        }
    },
    total_harga_sewa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status_transaksi: {
        type: DataTypes.ENUM('finish', 'pending', 'batal'),
        allowNull: false,
        defaultValue: 'pending'
    },
    sewa_expired: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    bukti_pembayaran: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    landId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

// Define relationships
Users.hasMany(Transactions, { foreignKey: 'userId' });
Transactions.belongsTo(Users, { foreignKey: 'userId' });

Land.hasMany(Transactions, { foreignKey: 'landId' });
Transactions.belongsTo(Land, { foreignKey: 'landId' });

export default Transactions;