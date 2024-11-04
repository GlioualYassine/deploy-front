"use client"
import React from 'react';
import HeaderAutomobiles from './components/HeaderAutomobiles/HeaderAutomobiles';
import ListAutomobiles from './components/ListAutomobiles/ListAutomobiles';

const Page = () => {
  return (
      <div>
        <HeaderAutomobiles />
        <ListAutomobiles />
      </div>
  );
}

export default Page;
