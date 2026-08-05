import User from "@/app/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'


export async function POST(req: NextRequest) {


    try {

        await connectDB()

        const {email , password} =  await req.json();

        // validation

        if (!email || !password) {

            return NextResponse.json({

                success: false,
                message: "Email and password are required"
            }, {status: 400})
            
        };

        // find User 

        const user = await User.findOne({email})

        if (!user) {

            return NextResponse.json({

                success: false,
                message: "Invalid email or password"
            }, {status: 401})
            
        }

        // compare password

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {

            return NextResponse.json({

                success: false,
                message: "Invalid email or password"
            }, {status: 401})
            
        }

        // if match generate token

        const token = jwt.sign({

            userId: user._id.toString(),
            email: user.email
        },

        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    )

    return NextResponse.json({

        success: true,
        message: "Login successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    }, {status: 200})


        
    } catch (error) {

        console.error(error)

        return NextResponse.json({
            success: false,
            message: "Internal Server error,"
        }, {status: 500})
        
    }

}