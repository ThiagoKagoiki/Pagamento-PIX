import db from "@/models";
import { NextResponse } from "next/server"

const ABACATE_KEY = process.env.ABACATE_KEY

async function seeStatusPaymentsById(cpfObj: string) {
    try {
        console.log("CPF USER: ", cpfObj)
        if (!cpfObj) { return NextResponse.json({ message: "CPF NAO INFORMADO NA VERIFICACAO" }, { status: 400 }) }
        const coluna_database = await db.Payments.findOne({
            where: {
                cpf_user: cpfObj
            },
            attributes: ["payment_abacate_id"]
        })
        const id_compra_json = await coluna_database?.toJSON();
        console.log(">>>>>", id_compra_json?.payment_abacate_id)
        const id_value = String(id_compra_json?.payment_abacate_id).trim()


        const response = await fetch(`http://localhost:3000/api/payments/abacate`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${ABACATE_KEY}`
            }
        })

        const responseData = await response.json()
        const filter_by_id = responseData.data.filter((payment: { id: string }) => payment.id === id_value)
        console.log(">>>>", filter_by_id)

        const status_payment = filter_by_id[0].status

        if (status_payment == "PAID") {
            await db.Payments.update(
                { payment_abacate_status: "PAID" },
                {
                    where: { payment_abacate_id: id_value }
                }
            )
            return NextResponse.json({ ok: true }, { status: 200 })
        } else {
            return NextResponse.json({ ok: false }, { status: 400 })
        }

    } catch (err) {
        console.error("ERRO LOGIN GET: ", err)
    }
}

export async function POST(req: Request) {
    const cpf_request = await req.json();
    console.log(cpf_request)
    const cpf_user = cpf_request.cpf_user;

    if (!cpf_user) {
        return NextResponse.json(
            { error: "Informar CPF" },
            { status: 500 }
        );
    }
    try {
        console.log(typeof cpf_user)

        const findCpf = await db.Payments.findOne({
            attributes: ['payment_abacate_status'],
            where: { cpf_user: cpf_user }
        })


        const status = await seeStatusPaymentsById(cpf_user)
        console.log(status)
        if (!status?.ok) {
            return NextResponse.json({ message: "Pagamento pendente ou expirado" }, { status: 500 })
        }

        if (!findCpf) return NextResponse.json({ message: "Nenhum pagamento nesse CPF", link: 'http://localhost:3000/reproveds' }, { status: 400 });

        return NextResponse.json({ message: "Acesso realizado", link: 'http://localhost:3000/approveds' }, { status: 200 });
    } catch (err) {
        console.error("Erro na tentativa de login")
        return NextResponse.json({ message: "Erro ao tentar logar: " + err, status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const cpf = req.body;

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