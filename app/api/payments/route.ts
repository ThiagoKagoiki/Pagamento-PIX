import { NextResponse } from "next/server";

const ABACATE_KEY = process.env.ABACATE_KEY

export async function POST(req: Request) {
    // console.log("VIVA"
    const { nome, email, telefone, cpf } = await req.json()
    console.log({ nome, email, telefone, cpf }, process.env.ABACATE_KEY)
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
        console.log(responseData)

        return NextResponse.json(responseData)

    } catch (err) {
        console.error("ERROR NO REDIRECT: ", err)
        return NextResponse.json(
            { error: "Erro interno no pagamento" },
            { status: 500 }
        );
    }
}

export async function GET(){
    try{
        const response = await fetch('https://api.abacatepay.com/v1/billing/list', {
            method: 'GET',
            headers: {
                authorization: `Bearer: ${ABACATE_KEY}`
            }
        })

        const responseData = await response.json()
        console.log(responseData)

        return NextResponse.json(responseData)

    }catch(err){
        console.error("ERROR AO LISTAR: ", err)
        return NextResponse.json(
            { error: "Erro interno no pagamento" },
            { status: 500 }
        );
    }
}