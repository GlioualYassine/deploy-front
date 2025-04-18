import React from "react";
import HeaderClients from "./components/HeaderClients/HeaderClients";
import ListCLients from "./components/ListClients/ListClients";

const page = () => {
  return (
    <div>
      <HeaderClients />
      <ListCLients />
    </div>
  );
};

export default page;
