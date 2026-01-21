// export const runtime = 'edge'

import { connectionBd } from '@/models'

export async function GET(){
    await connectionBd()
    return Response.json({ ok: true })
}