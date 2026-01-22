import db from "@/models";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const cpf = searchParams.get('cpf') //colocar o '?' na url na hora da busca

        if (!cpf) return NextResponse.json({ error: "CPF faltante" }, { status: 400 });
        try {
            const status = await db.Payments.findOne({
                attributes: ["payment_abacate_status"],
                where: { cpf_user: cpf }
            })

            return NextResponse.json({ status });
        } catch (err) {
            return NextResponse.json({ error: "Erro ao buscar status" }, { status: 500 });
        }
    } catch (err) {
        console.error("Error to verify status: ", err)

    }
}