import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

export default function Login() {
  return (
    <div className="container min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden lg:block h-full after:absolute after:inset-0 after:bg-black/30">
        <Image
          src="/images/auth.jpg"
          layout="fill"
          objectFit="cover"
          alt="Pengadilan Negeri Semarapura"
        />
      </div>
      <div className="sm:w-[350px] m-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan username dan password anda
          </p>
        </div>
        <div className="mt-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
