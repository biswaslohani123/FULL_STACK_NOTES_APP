"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

export default function page() {

    const router = useRouter()
    

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false)


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        try {

            setLoading(true)

            const response = await fetch('/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })

            const data = await response.json();

            if (!response.ok) {

                toast.error(data.message)
                return;
                
            }

            localStorage.setItem("token", data.token)
            toast.success(data.message)

            router.push('/dashboard')
            
        } catch (error) {

            console.error(error)
         
            
        } finally {
            setLoading(false)
        }

    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

        <Card className="w-full max-w-md">

            <CardHeader>
                <CardTitle className="text-center text-3xl">
                    Register
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="">
                        <label className="text-sm font-medium text-slate-700">Name</label>
                        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-black focus:right-2 focus:ring-slate-300 mt-2" type="text" name="name" placeholder="Enter your name" />
                    </div>

                    <div className="space-y-2">

                        <label className="text-sm font-medium text-slate-700">Email</label>

                        <input onChange={(e) => setEmail(e.target.value)} value={email} className="w-full mt-3 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-black focus:right-2 focus:ring-slate-300" type="email" name="email" placeholder="Enter your email" />

                    </div>

                    <div className="space-y-2">

                        <label className="text-sm font-medium text-slate-700">Password</label>

                        <div className="relative mt-3">

                            
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className="w-full mt-3 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-black focus:right-2 focus:ring-slate-300" type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" />

                        <button  type="button" onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-3 flex items-center mx-auto rounded-full cursor-pointer'>

                            {showPassword ? (
                                <EyeOff className="h-5 w-5"/>
                            ): (
                                <Eye className="h-5 w-5"/>
                            )}

                        </button>


                        </div>


                    </div>

                    <Button type="submit" disabled={loading} className='w-full active:bg-gray-700 cursor-pointer'>
                        {loading ? "Registering..." : "Register"}
                    </Button>

                </form>
                
                <p onClick={() => router.push('/login')} className="mt-3 text-center">Already Have an account ? <span className="text-blue-600 underline font-bold cursor-pointer hover:text-blue-500">Login</span></p>

            </CardContent>

        </Card>
      
    </div>
  )
}
