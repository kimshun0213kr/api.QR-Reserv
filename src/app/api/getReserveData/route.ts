import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"
import prisma from "@/lib/prisma"

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
    const res = await req.json()
    
    let isAlreadyBuy = false
    let allAmount = 0
    let reservegoods:string[] = []
    let name = res.name
    console.log("API log",res.name)
    await createHash(String(res.name)).then(async (hashName) => {
        console.log("API HASH LOG:",hashName)
        const result = await prisma.reservation.findMany({
            where:{
                name:"plr34DsdFbbe9aPGxQajqABU9qAxDkb2ScYCP3qBkQ=="
            }
        })
        for(let i = 0;i < result.length;i++){
            for(let j = 0;j < result[i].reservegoods.length;j++){
                reservegoods.push(result[i].reservegoods[j])
            }
            allAmount += result[i].allamount
            isAlreadyBuy = isAlreadyBuy || result[i].isAlreadyBuy
        }
    })
    return NextResponse.json({
        name:name,reservegoods:reservegoods,allamount:allAmount,isAlreadyBuy:isAlreadyBuy
    })
}