import React, { useState } from "react";
import { SidebarItemProps } from "./SidebarItem.types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ChevronDown, Wallet } from "lucide-react";
import { BookUser, Building2, DollarSign } from 'lucide-react';
import { motion } from "framer-motion";

const SidebarItem = (props: SidebarItemProps) => {
  const { item } = props;
  const { href, icon: Icon, label } = item;
  const pathname = usePathname();
  const activePath = pathname === href;
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [paymentSubMenuOpen, setPaymentSubMenuOpen] = useState(false);

  const toggleSubMenu = () => setSubMenuOpen(!subMenuOpen);
  const togglePaymentSubMenu = () => setPaymentSubMenuOpen(!paymentSubMenuOpen);

  let isClient = href === "/clients";
  let isPayment = href === "/paiement";

  return (
    <div>
      {isClient ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-slate-300/20 transition-colors duration-300 ${
              pathname.includes(href) ? "bg-zinc-100" : ""
            }`}
          >
            <div className="flex flex-row items-center text-sm justify-between w-full">
              <div className="flex flex-row items-center gap-x-2">
                <Icon className="h-5 w-5" strokeWidth={1} />
                {label}
              </div>
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  subMenuOpen ? "rotate-180" : ""
                }`}
                strokeWidth={1}
              />
            </div>
          </button>

          <motion.div
            initial={false}
            animate={subMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2, ease: "easeInOut" }
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="my-2 flex flex-col space-y-2 bg-slate-100 dark:bg-slate-800  rounded-md shadow-sm p-2">
              <Link
                href="/utilisateurs"
                className={cn(
                  `flex gap-x-2 mt-2 light:text-slate-700 dark:text-white text-sm items-center
              hover:bg-slate-200 dark:hover:text-slate-900 p-2 rounded-lg cursor-pointer transition-colors duration-300`,
                  activePath && "bg-slate-400/20"
                )}
              >
                <BookUser className="h-5 w-5" strokeWidth={1} />
                Utilisateurs
              </Link>
              <Link
                href="/companies"
                className={cn(
                  `flex gap-x-2 mt-2 light:text-slate-700 dark:text-white text-sm items-center
              hover:bg-slate-200 p-2 dark:hover:text-slate-900  rounded-lg cursor-pointer transition-colors duration-300`,
                  activePath && "bg-slate-400/20"
                )}
              >
                <Building2 className="h-5 w-5" strokeWidth={1} />
                Companies
              </Link>
            </div>
          </motion.div>
        </>
      ) : isPayment ? (
        <>
          <button
            onClick={togglePaymentSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-slate-300/20 transition-colors duration-300 ${
              pathname.includes(href) ? "bg-zinc-100" : ""
            }`}
          >
            <div className="flex flex-row items-center text-sm justify-between w-full">
              <div className="flex flex-row items-center gap-x-2">
                <Icon className="h-5 w-5" strokeWidth={1} />
                {label}
              </div>
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  paymentSubMenuOpen ? "rotate-180" : ""
                }`}
                strokeWidth={1}
              />
            </div>
          </button>

          <motion.div
            initial={false}
            animate={paymentSubMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2, ease: "easeInOut" }
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="my-2 flex flex-col space-y-2 bg-slate-100 dark:bg-slate-800 rounded-md shadow-sm p-2">
              <Link
                href="/paiement/saisir"
                className={cn(
                  `flex gap-x-2 mt-2 light:text-slate-700 dark:text-white text-sm items-center
              hover:bg-slate-200 dark:hover:text-slate-900 p-2 rounded-lg cursor-pointer transition-colors duration-300`,
                  activePath && "bg-slate-400/20"
                )}
              >
                <DollarSign className="h-5 w-5" strokeWidth={1} />
                Saisir une facture
              </Link>
              <Link
                href="/paiement/historique"
                className={cn(
                  `flex gap-x-2 mt-2 light:text-slate-700 dark:text-white text-sm items-center
              hover:bg-slate-200 p-2 dark:hover:text-slate-900  rounded-lg cursor-pointer transition-colors duration-300`,
                  activePath && "bg-slate-400/20"
                )}
              >
                <Wallet className="h-5 w-5" strokeWidth={1} />
                Historique de factures
              </Link>
            </div>
          </motion.div>
        </>
      ) : (
        <Link
          href={href}
          className={cn(
            `flex gap-x-2 mt-2 light:text-slate-700 dark:text-white text-sm items-center
        hover:bg-slate-300/20 p-2 rounded-lg cursor-pointer`,
            activePath && "bg-slate-400/20"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1} />
          {label}
        </Link>
      )}
    </div>
  );
};

export default SidebarItem;
