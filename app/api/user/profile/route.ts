import { cookies } from 'next/headers'
import prisma from '@/utils/prismaClient';
import jwt from 'jsonwebtoken';
export async function POST(req: Request) {
  const data = await req.json();
    const cookieStore = await cookies();
    //@ts-ignore
    const token = (await cookieStore.get('token'))?.value;  
    if (!token) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
    }   
    try {
        let fieldsToUpdate: any = {};
        const { designation, bio } = data;
        if(designation) fieldsToUpdate.designation = designation;
        if(bio) fieldsToUpdate.bio = bio;
        await prisma.user.updateMany({
            //@ts-ignore
            where: { email: jwt.verify(token, "SECRET").email },
            data: { designation, bio },
        });

        return new Response(JSON.stringify({ success: true }))
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ success: false, error: err }), { status: 500 });
    }

}