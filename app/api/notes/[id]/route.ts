import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Note from "@/app/models/Note";



interface Params {

    params: Promise<{

        id: string
    }>
}


export async function PATCH(req: NextRequest, { params } : Params){


    try {

        await connectDB();

        // Authorization header
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
                
            return NextResponse.json({

                success: false,
                message: "Unauthorized"
            }, {status: 401})
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // verify token 
        const decoded = verifyToken(token);

        // get note id

        const {id} = await params;

        // request body

        const {title, content} = await req.json();

        // update only if the note belongs to the logged-in user

        const updateNote = await Note.findOneAndUpdate({

            _id: id,
            userId: decoded.userId
        },

        {
            title,
            content
        },
        {
            new: true
        }
    
        );

        if (!updateNote) {

            return NextResponse.json({
                success: false,
                message: "Note not found"
            }, {status: 404})
            
        }

        return NextResponse.json({

            success: true,
            message: "Note updated successfully",
            note: updateNote
        })
        
    } catch (error) {

        console.error(error)

        return NextResponse.json({

            success: false,
            message: "Internal Server Error"
        }, {status: 500})
        
    }

}

// delete Note

export async function DELETE(req: NextRequest, {params}: Params){

    try {

        await connectDB();

        // get authorization header

        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith("Bearer")) {

            return NextResponse.json({

                success: false,
                message: "Unauthorized"
            }, {status: 401})
            
        }

        // extract token

        const token = authHeader.split(' ')[1];

        // verify token
        const decoded = verifyToken(token);

        // get note id

        const { id } = await params;
        

        // delete only if the note belongs tp the logged in user

        const deletedNote = await Note.findOneAndDelete({

            _id: id,
            userId: decoded.userId
        });

        if (!deletedNote) {

            return NextResponse.json({

                success: false,
                message : "Note not found"
            }, {status: 404})
            
        }

        return NextResponse.json({

            success: true,
            message: "Note deleted successfully"
        }, {status: 200})

        
    } catch (error) {

        return NextResponse.json({

            success: false,
            message: "Internal sever error"
        }, {status: 500})
        
    }


}