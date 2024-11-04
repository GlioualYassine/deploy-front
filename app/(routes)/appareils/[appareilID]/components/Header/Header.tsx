"use client";
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Header = () => {
    const router = useRouter()
  return (
    <div className='flex items-center text-xl'>
        <ArrowLeft className='mr-2 w-5 h-5 cursor-pointer' onClick={()=>router.push('/automobiles')} />
        Editer Appareil GPS
    </div>
  )
}

export default Header