import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(){
    const result = await prisma.goods.findMany({
        where:{
            reserveLimit :{
                gt: new Date()
            }
        },orderBy:[{reserveLimit:"asc"},{amount:"asc"},{id:"asc"}]
    })
    let returnData = []
    for(let i = 0;i<result.length;i++){
        returnData.push([result[i].id,result[i].name,result[i].amount,result[i].maxPiece])
    }
    return NextResponse.json(returnData)
}