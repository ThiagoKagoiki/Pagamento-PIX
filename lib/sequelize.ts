import { Sequelize } from "sequelize";
import pg from 'pg';

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        dialectModule: pg, // <- fez conectar com o BD
        logging: false,
        port: Number(process.env.DB_PORT) || 5432
    }
)

export default sequelize