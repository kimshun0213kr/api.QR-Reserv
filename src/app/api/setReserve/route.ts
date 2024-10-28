import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
            name:request.name,
            reservegoods: reservegoods,
            allamount:total,
            isAlreadyBuy:false
        }
    })
    return NextResponse.json({
        result
    })   
}