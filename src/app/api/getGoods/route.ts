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
    console.log(result)
    return NextResponse.json(result)
}