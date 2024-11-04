// pages/add-device.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ListDevices from "./components/ListDevices/ListDevice";
import HeaderDevice from "./components/HeaderDevice/HeaderDevice";



const AddDevicePage = () => (
  <div className='w-full '>
    <HeaderDevice/>
    <div className="">
      <ListDevices />
    </div>
  </div>
);

export default AddDevicePage;
