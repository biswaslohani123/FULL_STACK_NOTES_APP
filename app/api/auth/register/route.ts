import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from '@/app/models/User'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'


export async function POST (req: NextRequest) {

    try {

        await connectDB()

        const {name, email, password} = await req.json();

        // validation

        if (!name || !email || !password) {

            return NextResponse.json({
                success: false,
                message: "All fields are required"

            }, {status: 400})
            
        }

        // check if user already exists

        const existingUser = await User.findOne({email})

        if (existingUser) {

            return NextResponse.json({

                success: false,
                message: "User already exists"
            }, {status: 400})
            
        }

        //  if user doesn't exists then hash the password

        const hashPassword = await bcrypt.hash(password, 10);

        // create user 

        const user = await User.create({

            name,
            email,
            password: hashPassword
        });

        // after creating user generating token

        const token = jwt.sign (

            {
                userId: user._id.toString(),
                email: user.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '7d'
            }
        )

        // after token creating response

        const response = NextResponse.json({

            success: true,
            message: "User registered successfully",
            user : {
                id: user._id,
                name: user.name,
                email: user.email
            } ,

        }, {status: 201})

         // Set HTTP-only cookie

        response.cookies.set({

            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: '/'


        })

        return response


        
    } catch (error) {

        console.error(error);

        return NextResponse.json({

            success: false,
            message: "Internal Server Error"
        }, {status: 500})
        
    }
}