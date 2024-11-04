import React from "react";
import {
  Appareil,
  AppareilInformationProps,
} from "./AppareilInformation.types";
import AppareilForm from "../AppareilForm/AppareilForm";

const AppareilInfrormation = (props: AppareilInformationProps) => {
  const { appareil } = props;

  return (
    <div className="mt-5 grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <AppareilForm appareil={appareil} />
      </div>
    </div>
  );
};

export default AppareilInfrormation;
