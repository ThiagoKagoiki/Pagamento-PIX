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

  const API = axios.create({
    baseURL: "http://localhost:3001/",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.ABACATE_KEY
    }
  })

  const callPaymentAPI = async() => {
    try{
      await API.post('/payment/singular')
    }catch(err){
      console.error("ERROR NO REDIRECT: ", err)
    }
  }

  return (
    <div>
      <form action="">
        <input type="text" placeholder="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required/>
        <input type="text" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required/>
        <input type="text" placeholder="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required/>
        <input type="text" placeholder="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value})} required/>
        <button type="submit">Pagar</button>
      </form>
    </div>
  );
}
