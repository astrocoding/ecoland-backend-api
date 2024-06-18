    import { Sequelize } from "sequelize";
    import db from "../config/db.js";
    import Users from "./UserModel.js";

    const {DataTypes} = Sequelize;

    const Land = db.define('land',{
        uuid:{
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        nama_lahan:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        nama_pemilik:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        harga_sewa:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true        
            }
        },
        lokasi:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
            }
        },
        tanggal_awal:{
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        tanggal_selesai:{
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        luas_lahan:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        keterangan:{
            type: DataTypes.TEXT,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.ENUM('tersedia', 'telah disewa'),
            allowNull: false,
            defaultValue: 'tersedia'
        },
        image:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        }
    },{
        freezeTableName: true
    });

    Users.hasMany(Land);
    Land.belongsTo(Users, {foreignKey: 'userId'});

    export default Land;