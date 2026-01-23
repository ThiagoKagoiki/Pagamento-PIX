// import db from "@/models";
// import { NextResponse } from "next/server";

// const ABACATE_KEY = process.env.ABACATE_KEY;

// export async function GET(req: Request) {
//     try{
//         const
//         const id = await db.Payments.findOne({
//             where: {
//                 cpf_user: 
//             }
//         })

//         const response = await fetch('https://api.abacatepay.com/v1/pixQrCode/check', {
//             method: 'GET',
//             headers: {
//                 authorization: `Bearer: ${ABACATE_KEY}`
//             }
//         })

//         const responseData = await response.json()
//         console.log(responseData)

//         return NextResponse.json(responseData)
//     }catch(err){
//         console.error("Erro ao atualizar status dos pagamentos: ", err)
//     }
// }