"use client";

import React from "react";
import Image from "next/image";
import { frontStackList, backStackList } from "@/shared/consts/language-images";

function TechFrontStackList() {
  return (
    <div className="w-525 h-24 flex justify-evenly itmes-center rounded-3xl bg-[#363B46]">
      {frontStackList.map((item, key) => {
        return (
          <div
            className="w-1/5 h-full flex justify-center items-center rounded-3xl"
            key={key}
          >
            <Image src={item} alt={item} width={40} height={40} />
          </div>
        );
      })}
    </div>
  );
}

function TechBackStackList() {
  return (
    <div className="w-525 h-24 flex justify-evenly itmes-center rounded-3xl bg-[#363B46]">
      {backStackList.map((item, key) => {
        return (
          <div
            className="w-1/5 h-full flex justify-center items-center rounded-3xl"
            key={key}
          >
            <Image src={item} alt={item} width={40} height={40} />
          </div>
        );
      })}
    </div>
  );
}

export { TechFrontStackList, TechBackStackList };
