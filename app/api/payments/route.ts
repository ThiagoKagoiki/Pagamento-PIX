import db from "@/models";
import { NextResponse } from "next/server";

const ABACATE_KEY = process.env.ABACATE_KEY

async function postPaymentBd(payment_abacate_id: string, payment_abacate_status: string, cpf_user: string) {

    try {
        if (!payment_abacate_id || !payment_abacate_status || !cpf_user) {
            // console.log("HERE IS FAILING")
            return NextResponse.json({ message: "Where r the info!?" })
        }

        const newPayment = await db.Payments.create({
            cpf_user, payment_abacate_id, payment_abacate_status
        })

        return NextResponse.json({ message: "Payment criado com sucesso", status: 201, newPayment })

    } catch (err) {
        console.error("Error posting to postgres Payments: ", err)
    }
}

async function verifyCpfBd(cpf_user: string) {
    try {
        const existente = await db.Payments.findOne({ where: { cpf_user } })

        if (existente) return NextResponse.json({ message: "CPF já tem um pagamento", status: 400 }) //adicionar para verificar o status tambem

        return NextResponse.json({ message: "No CPF with Payment" })
    } catch (err) {
        console.error("Error to verify cpf: ", err)

    }
}

export async function POST(req: Request) {

    const { nome, email, telefone, cpf } = await req.json()
    const existCpf = await verifyCpfBd(cpf)
    if(existCpf) {
        return NextResponse.json(
            { error: "CPF ja tem payment" },
            { status: 500 }
        );
    }
    try {
        const response = await fetch('https://api.abacatepay.com/v1/billing/create', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${ABACATE_KEY}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                frequency: "ONE_TIME",
                methods: ["PIX"],
                products: [
                    {
                        externalId: `${Date.now()}-${Math.random()}`,
                        name: "Mensalidade thigasweb",
                        description: "Acesso ao programa fitness premium por 1 mês.",
                        quantity: 1,
                        price: 100
                    }
                ],
                returnUrl: "http://localhost:3000/",
                completionUrl: "https://thiagoyukio.com.br/",
                // customerId: "",
                customer: {
                    name: nome,
                    cellphone: telefone,
                    email: email,
                    taxId: cpf
                },
            })
        })

        if (!response.ok) throw new Error("Falha ao criar pagamento");

        const responseData = await response.json()

        await postPaymentBd(responseData.data.id, responseData.data.status, cpf)

        return NextResponse.json(responseData)

    } catch (err) {
        console.error("ERROR NO REDIRECT: ", err)
        return NextResponse.json(
            { error: "Erro interno no pagamento" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const response = await fetch('https://api.abacatepay.com/v1/billing/list', {
            method: 'GET',
            headers: {
                authorization: `Bearer: ${ABACATE_KEY}`
            }
        })

        const responseData = await response.json()
        console.log(responseData)

        return NextResponse.json(responseData)

    } catch (err) {
        console.error("ERROR AO LISTAR: ", err)
        return NextResponse.json(
            { error: "Erro interno no pagamento" },
            { status: 500 }
        );
    }
}