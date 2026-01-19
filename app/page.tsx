'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { paymentPix } from "./api/payments/pix";

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
      await paymentPix(form)

    } catch (err) {
      console.error("ERROR NO REDIRECT: ", err)
    }
  }
  console.log(`${process.env.ABACATE_KEY}`)
  

  return (
    <div>
      <form onSubmit={callPaymentAPI}>
        <input type="text" placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}  required/>
        <input type="text" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}  required/>
        <input type="text" placeholder="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}  required/>
        <input type="text" placeholder="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}  required/>
        <button type="submit">Pagar</button>
      </form>
    </div>
  );
}
