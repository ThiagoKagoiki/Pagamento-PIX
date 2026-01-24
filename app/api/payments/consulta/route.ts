import db from "@/models";
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const cpf_user = searchParams.get("cpf_user")

    if (!cpf_user) {
        return NextResponse.json(
            { error: "Informar CPF" },
            { status: 500 }
        );
    }
    try {
        const response = await db.Payments.findOne({
            attributes: ["payment_abacate_status", "link_payment"],
            where: { cpf_user: cpf_user }
        })
        const responseData = await response?.toJSON()

        if(responseData.payment_abacate_status == "PAID"){
            return NextResponse.json({ message: "Nenhuma cobrança pendente" })
        }

        return NextResponse.json({ message: "Cobranca pendente", link_payment: responseData.link_payment });

    } catch (err) {
        console.error("Error to verify status: ", err)

    }
}