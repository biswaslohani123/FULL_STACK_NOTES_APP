"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";



interface User {
  name: string;
  email: string;
}

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      
       <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        refresh
      />

      <div className="relative z-10 text-center">
  <h1 className="text-5xl font-bold text-white">
    📝 Notes App
  </h1>

  {user ? (
    <>
      <h2 className="mt-6 text-3xl font-semibold text-white">
        Welcome, {user.name} 👋
      </h2>

      <p className="mt-4 text-gray-300">
        Organize your notes securely and access them anytime.
      </p>

      <Button
        className="mt-8"
        size="lg"
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </Button>
    </>
  ) : (
    <>
      <h2 className="mt-6 text-3xl font-semibold text-white">
        Welcome 👋
      </h2>

      <p className="mt-4 text-gray-300">
        Create an account to start saving and managing your notes.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>

        <Button
          onClick={() => router.push("/register")}
        >
          Register
        </Button>
      </div>
    </>
  )}
</div>
    </main>
  );
}