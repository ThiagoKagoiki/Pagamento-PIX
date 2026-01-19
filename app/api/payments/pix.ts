export const paymentPix = async ({ nome, email, telefone, cpf }: any) => {
    try {
        const response = await fetch('https://api.abacatepay.com/v1/billing/create', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.ABACATE_KEY}`,
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
                customer: {
                    name: nome,
                    cellphone: telefone,
                    email: email,
                    taxId: cpf
                },
            })
        })

        if (!response.ok) throw new Error("Falha ao criar pagamento");

        const responseData = response.json()
        console.log(responseData)

    } catch (err) {
        console.error("ERROR NO REDIRECT: ", err, process.env.ABACATE_KEY)
    }
}