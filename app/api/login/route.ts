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



        if (!findCpf) return NextResponse.json({ message: "Nenhum pagamento nesse CPF", link: 'http://localhost:3000' }, { status: 400 });

        const status = await seeStatusPaymentsById(cpf_user)
        console.log(status)
        if (!status?.ok) {
            return NextResponse.json({ message: "Pagamento pendente ou expirado", link: 'http://localhost:3000/reproveds' }, { status: 500 })
        }

        return NextResponse.json({ message: "Acesso realizado", link: 'http://localhost:3000/approveds' }, { status: 200 });
    } catch (err) {
        console.error("Erro na tentativa de login")
        return NextResponse.json({ message: "Erro ao tentar logar: " + err, link: 'http://localhost:3000/' }, { status: 500 })
    }
}

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