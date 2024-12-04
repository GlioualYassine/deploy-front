"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"



const Logo = () => {
    const router = useRouter();
  return (
    <div className="min-h-20 h-20 flex items-center mt-4 border-b cursor-pointer "
        onClick={()=>router.push("/")}>
    
        <Image src="/logo.png" width={100} height={100} alt="logo" className="mt-2" priority/>
        <h1 className="font-bold text-xl">RAMYCAN</h1>
    </div>
  )
}

export default Logo