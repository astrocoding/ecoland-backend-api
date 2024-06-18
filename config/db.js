import {Sequelize} from "sequelize";

const db = new Sequelize(
    'db_dummy', 
    'root', 
    'ecoland123', 
    {
        host: '34.101.190.201',
        dialect: "mysql"
});

export default db;
