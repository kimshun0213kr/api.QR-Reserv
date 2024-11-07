import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const crypto = require("crypto")

const hash32key = String(process.env.NEXT_PUBLIC_hash32);
const hashIV = String(process.env.NEXT_PUBLIC_hashIV);

const createHash = async (original: string): Promise<string> => {
    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        Buffer.from(hash32key, 'hex'),
        Buffer.from(hashIV, 'hex')
    );

    const encrypted = Buffer.concat([
        cipher.update(original, 'utf8'),
        cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([encrypted, tag]).toString('base64');
};

export async function POST(req:NextRequest){
    const request = await req.json()
    let reservegoods = []
    let total = 0
    for(let i=1;i<request.data.length;i++){
        reservegoods.push(request.data[i][0]+"×"+request.data[i][1])
        total += request.data[i][2]
    }
    for(let j=0;j<reservegoods.length;j++){
        await prisma.goods.updateMany({
            where:{
                name:request.data[j][0]
            },
            data:{
                reservePiece: {increment: request.data[j][1]}
            }
        })
    }
    const result = await prisma.reservation.create({
        data:{
            name:await createHash(request.name),
            reservegoods: reservegoods,
            allamount:total,
            isAlreadyBuy:false
        }
    })
    return NextResponse.json({
        result
    })   
}