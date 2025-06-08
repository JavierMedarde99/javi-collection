import { Badge } from "@/components/ui/badge"
import React from "react";

interface TypesButtonsProps {
    type: string;
    setType: (type: string) => void;
    listButtons: string[];
  }

const TypesButtons: React.FC<TypesButtonsProps> = ({ type, setType, listButtons }) => {

    const handleTypeClick = (typeClick: string) => {
        setType(typeClick);
    };

  return (
    <div className="flex flex-row justify-around w-full mt-3 mb-3 ">
      {listButtons.map((buttonType) => (
        <Badge
          key={buttonType}
          variant={type === buttonType ? 'destructive' : 'secondary'}
          onClick={() => handleTypeClick(buttonType)}
          className="p-2"
        >
          {buttonType == '' ? 'All' : buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}
        </Badge>
      ))}
    </div>
  );
}

export {TypesButtons};
