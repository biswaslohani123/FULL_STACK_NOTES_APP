import User from "@/app/models/User";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {

    try {

        await connectDB()

        // get Authorization header
        const authHeader = req.headers.get('authorization');

        // check if token exists
        if (!authHeader || !authHeader.startsWith('Bearer')) {

            return NextResponse.json({

                success: false,
                message: "Unauthorized"
            }, {status: 401})
            
        }
        
        // Extract token
        const token = authHeader.split(" ")[1];

        // verify token
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {

            return NextResponse.json({
                success: false,
                message: "User not found"
            })
            
        }

        // return decoded data
        return NextResponse.json({

            success: true,
            user
        }, {status: 200})

    } catch (error) {

        return NextResponse.json({

            success: false,
            message: "Invalid or expired token"
        }, {status: 401})
        
    }
}