import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Note from '@/app/models/Note'


// create Note
export async function POST(req: NextRequest) {

    try {

        await connectDB();

        // get token from authorization Header
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {

            return NextResponse.json({

                success: false,
                message: "Unauthorized"
            }, {status: 401})
            
        }

        // extract token 

        const token = authHeader.split(' ')[1]

        // verify token

        const decoded = verifyToken(token)

        const {title, content} = await req.json()

        // validation

        if (!title || !content) {

            return NextResponse.json({

                success: false,
                message: "Title and content are required"
            }, {status: 400})
            
        }

        // create Note

        const note = await Note.create({

            title,
            content,
            userId: decoded.userId
        });

        return NextResponse.json({

            success: true,
            message: "Note created successfully",
            note
        }, {status: 200})

        
    } catch (error) {


        console.error(error);
        return NextResponse.json({

            success: false,
            message: "Internal Server Error"
        }, {status: 500})
        
    }


}


// Get Notes 

export async function GET(req: NextRequest) {


    try {
        
        await connectDB()

        // get authorization header 

        const authHeader = req.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer')) {

            return NextResponse.json({

                success: false,
                message: "Unauthorized"
            }, {status: 401})
            
        }

        // extract token

        const token = authHeader.split(' ')[1]

        // verify token
        const decoded = verifyToken(token);

        // Getting notes of logged in user

        const notes = await Note.find({

            userId: decoded.userId,
        }).sort({createdAt: -1})

        return NextResponse.json({

            success: true,
            count: notes.length,
            notes
        }, {status: 200})
        
    } catch (error) {

        console.error(error)

        return NextResponse.json({

            success: false,
            message: "Internal server error"
        }, {status: 500})
        
    }

}