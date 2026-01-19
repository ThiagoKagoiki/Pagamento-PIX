'use client'

import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  type Pagante = {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
  }

  const [form, setForm] = useState<Pagante>({
    nome: "",
    email: "",
    telefone: "",
    cpf: ""
  });

  const callPaymentAPI = async () => {
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
              externalId: "1",
              name: "Mensalidade thigasweb",
              description: "Acesso ao programa fitness premium por 1 mês.",
              quantity: 1,
              price: 100
            }
          ],
          returnUrl: "http://localhost:3000/",
          completionUrl: "thiagoyukio.com.br/",
          customer: {
            name: form.nome,
            cellphone: form.telefone,
            email: form.email,
            taxId: form.cpf
          },
        })
      })
    } catch (err) {
      console.error("ERROR NO REDIRECT: ", err)
    }
  }

  return (
    <div>
      <form action="">
        <input type="text" placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input type="text" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="text" placeholder="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
        <input type="text" placeholder="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} required />
        <button type="submit">Pagar</button>
      </form>
    </div>
  );
}
