import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";



export async function GET(req: NextResponse) {

    try {

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

        // return decoded data
        return NextResponse.json({

            success: true,
            user: decoded
        }, {status: 200})

    } catch (error) {

        return NextResponse.json({

            success: false,
            message: "Invalid or expired token"
        }, {status: 401})
        
    }
}