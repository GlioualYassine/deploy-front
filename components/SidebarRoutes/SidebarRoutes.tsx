"use client"
import { dataGeneralSidebar , dataSupportSidebar , dataToolsSidebar } from "@/components/SidebarRoutes/SidebarRoutes.data"
import SidebarItem from "@/components/SidebarItem/SidebarItem"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const SidebarRoutes = () => {
  return (
    <div className="flex flex-col mt-2 justify-between h-full">
        <div>
          <div className="p-2 md:p-6">
            <p className="text-slate-500 mb-2">GENERAL</p>
            {dataGeneralSidebar.map((item)=>(
              <SidebarItem key={item.label} item={item}/>
            ))}
          </div>
          <Separator />
          <div className="p-2 md:p-6">
            <p className="text-slate-500 mb-2">TOOLS</p>
            {dataToolsSidebar.map((item)=>(
              <SidebarItem key={item.label} item={item}/>
            ))}
          </div>
          <Separator />
          {/* <div className="p-2 md:p-6">
            <p className="text-slate-500 mb-2">SUPPORT</p>
            {dataSupportSidebar.map((item)=>(
              <SidebarItem key={item.label} item={item}/>
            ))}
          </div> */}
          

        </div>
        <div>
          <Separator/>
          <footer className=" p-3 text-center">
          ©2024 Ramycan ,Created by NOSTRUM
          </footer>
        </div>
    </div>
  )
}

export default SidebarRoutes