import db from "@/models";
import { NextResponse } from "next/server"

const ABACATE_KEY = process.env.ABACATE_KEY

async function seeStatusPaymentsById(id: string) {
    try {
        const response = await fetch('https://api.abacatepay.com/v1/billing/list', {
            method: 'GET',
            headers: {
                authorization: `Bearer: ${ABACATE_KEY}`
            }
        })

        
    }catch(err){
        console.error("ERRO LOGIN GET")
    }
}

export async function POST(req: Request) {
    const cpf_user = await req.json();
    const cpf_user_string = String(cpf_user)
    if (!cpf_user) {
        return NextResponse.json(
            { error: "Informar CPF" },
            { status: 500 }
        );
    }
    try {
        console.log(typeof cpf_user_string)

        const findCpf = await db.Payments.findOne({
            attributes: ['payment_abacate_status'],
            where: { cpf_user: cpf_user_string }
        })

        if (!findCpf) return NextResponse.json({ message: "Nenhum pagamento nesse CPF", status: 400, link: 'http://localhost:3000/reproveds' });

        return NextResponse.json({ message: "Acesso realizado", status: 201, link: 'http://localhost:3000/approveds' });
    } catch (err) {
        console.error("Erro na tentativa de login")
        return NextResponse.json({ message: "Erro ao tentar logar: " + err, status: 500 })
    }
}