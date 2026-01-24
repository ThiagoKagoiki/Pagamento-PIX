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

  const [cpfAcesso, setAcessoCpf] = useState("")
  const [cpfCobrancas, setCpfCobrancas] = useState("")
  const [form, setForm] = useState<Pagante>({
    nome: "",
    email: "",
    telefone: "",
    cpf: ""
  });

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

  const seePayments = async (e: any) => {
    e.preventDefault()
    const response = await fetch('/api/payments', {
      method: "GET"
    })

    const responseData = await response.json()
    console.log(responseData)
  }

  const loginCpf = async (e: any) => {
    try {
      e.preventDefault()
      if(!cpfAcesso){
        return alert("Informe um CPF para acesso")
      }
      const response = await fetch('/api/login', {
        method: "POST",
        body: JSON.stringify({ cpf_user: String(cpfAcesso) ?? "" })
      })
      console.log("CPF PARA ACESSO: ", cpfAcesso)

      const responseData = await response.json()
      console.log(responseData)

      if (response.ok && responseData.link) {
        window.location.href = responseData.link;
      } else {
        alert("Erro ao gerar link de pagamento: " + (responseData.error || "Erro desconhecido"));
        window.location.href = responseData.link;
      }

      return { url: responseData.link }
    } catch (err) {
      console.error("ERROR NO LOGIN: ", err)
    } finally {
      setAcessoCpf("")
    }
  }

  const verCobrancaCpf = async (e: any) => {
    try{
      e.preventDefault()
      const response = await fetch('/api/payments/link_payment', {
        method: 'GET',
        body: JSON.stringify({ cpf_user: String(cpfCobrancas) ?? ""})
      })

      const responseData = await response.json()
      console.log(responseData)

      return { retorno: responseData}
    }catch(err){
      console.error("ERRO verCobrancaCpf: ", err)
    }
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
      <hr />
      <form onSubmit={loginCpf}>
        <input type="text" placeholder="CPF para acesso" value={cpfAcesso} onChange={(e) => setAcessoCpf(e.target.value)} />
        <button type="submit">Acessar</button>
      </form>

      <hr />
      <form onSubmit={verCobrancaCpf}>
        <input type="text" placeholder="CPF para ver a cobranca" value={cpfCobrancas} onChange={(e) => setCpfCobrancas(e.target.value)} />
        <button type="submit">Acessar</button>
      </form>
    </div>
  );
}
