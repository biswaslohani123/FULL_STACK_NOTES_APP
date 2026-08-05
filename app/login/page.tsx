"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { toast } from "sonner";



export default function page() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false)


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        try {

            setLoading(true);


            const response = await fetch('/api/auth/login', {

                method: "POST",
                headers: {
                    
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
                
            })


            const data = await response.json();

            if (!response.ok) {

                toast.error(data.message)
                return
                
            }

            // save jwt
            localStorage.setItem("token", data.token)

            toast.success(data.message)
            router.push('/dashboard')
            
        } catch (error) {
            
            console.error(error)
            
        }finally {
            setLoading(false)
        }
    }

    

  return (

    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

        <Card className="w-full max-w-md">

            <CardHeader>
                <CardTitle className="text-center text-3xl">
                    Login
                </CardTitle>
            </CardHeader>

            <CardContent>

                <form onSubmit={handleLogin} className="space-y-5">

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Email</Label>

                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter your email" className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-slate-300" />
                    </div>

                    <div className="space-y-2">

                        <label className="text-sm font-medium text-slate-700">Password</label>

                        <div className="relative mt-3">

                            
                        <input onChange={(e) => setPassword(e.target.value)} value={password}  className="w-full mt-3 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-black focus:right-2 focus:ring-slate-300" type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" />

                        <button  type="button" onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-3 flex items-center mx-auto rounded-full cursor-pointer'>

                            {showPassword ? (
                                <EyeOff className="h-5 w-5"/>
                            ): (
                                <Eye className="h-5 w-5"/>
                            )}

                        </button>


                        </div>


                    </div>


                    <Button type="submit" className='w-full cursor-pointer' disabled={loading}>
                            {loading ? "Logging in... ": "Login "}
                    </Button>


                </form>

                <p onClick={() => router.push('/register')} className="mt-3 text-center">Don't have an account? <span className="text-blue-700 underline hover:text-blue-500 font-bold cursor-pointer">Register</span> </p>

            </CardContent>

        </Card>
      
    </div>
  )
}
