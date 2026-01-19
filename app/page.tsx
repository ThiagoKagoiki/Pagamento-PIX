'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  // useEffect(() => {
  //   console.log("Iniciando...")
  // }, [form])

  const callPaymentAPI = async (e: any) => {
    try {
      e.preventDefault()
      const response = await fetch("/api/payments", {
        method: "POST",
        body: JSON.stringify(form)
      })

      const responseData = await response.json()
      console.log(responseData)

      if (responseData.data.url) {
        window.open(responseData.data.url)
      }

      return { url: responseData.data.url }
    } catch (err) {
      console.error("ERROR NO REDIRECT: ", err)
    } finally {
      setForm({
        nome: "",
        email: "",
        telefone: "",
        cpf: ""
      })
    }
  }
  // console.log(`${process.env.ABACATE_KEY}`)

  const seePayments = async (e: any) => {
    e.preventDefault()
    const response = await fetch('/api/payments', {
      method: "GET"
    })

    const responseData = await response.json()
    console.log(responseData)
  }


  return (
    <div>
      <form onSubmit={callPaymentAPI}>
        <input type="text" placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <input type="text" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="text" placeholder="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        <input type="text" placeholder="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
        <button type="submit">Pagar</button>
      </form>

      <button onClick={seePayments}>Ver cobrancas</button>
    </div>
  );
}
