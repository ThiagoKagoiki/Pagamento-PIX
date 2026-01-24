import db from "@/models";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const cpf_user = req.body

        const link = await db.Payments.findOne({
            where: { cpf_user: cpf_user},
            attributes: ["link_payment"]
        })

        // const responseData = await response.json()
        console.log("link: ",link)

        return NextResponse.json(link)

    } catch (err) {
        console.error("ERROR AO LISTAR: ", err)
        return NextResponse.json(
            { error: "Erro interno no pagamento" },
            { status: 500 }
        );
    }
}