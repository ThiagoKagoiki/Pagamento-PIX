import { Sequelize, DataTypes } from "sequelize"

export default (sequelize: Sequelize) => {
    const Payments = sequelize.define('Payments', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        cpf_user: { type: DataTypes.STRING, allowNull: false, unique: true },
        payment_abacate_id: { type: DataTypes.STRING, allowNull: false, unique: true },
        payment_abacate_status: { type: DataTypes.STRING, allowNull: false }
    })

    return Payments
}