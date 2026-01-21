import sequelize from "@/lib/sequelize";
import PaymentsModel from './Payments';
// import dotenv from 'dotenv'

// dotenv.config()

export async function connectionBd() {
    try{
        await sequelize.authenticate()
        await sequelize.sync({ force: false })
        console.log("Connect to Postgres!")
    }catch(err){
        console.error("Error connecting to the database: ", err)
    }
}

connectionBd()

const db = {
    sequelize,
    Payments: PaymentsModel(sequelize)
}

export default db