import { NextResponse } from "next/server";

const ABACATE_KEY = process.env.ABACATE_KEY;

export async function GET() {
    try {
        const response = await fetch('https://api.abacatepay.com/v1/billing/list', {
            method: 'GET',
            headers: {
                authorization: `Bearer: ${ABACATE_KEY}`
            }
        })

        const responseData = await response.json()

        return NextResponse.json(responseData)

    } catch (err) {
        console.error("ERROR AO LISTAR: ", err)
        return NextResponse.json(
            { error: "Erro interno no pagamento" },
            { status: 500 }
        );
    }
}