import { Badge } from "@/components/ui/badge"
import React from "react";

interface TypesButtonsProps {
    booktype: string;
    setbooktype: (type: string) => void;
  }

const TypesButtons: React.FC<TypesButtonsProps> = ({ booktype, setbooktype }) => {

    const handleTypeClick = (typeBookClick: string) => {
        setbooktype(typeBookClick);
    };

  return (
    <div className="flex flex-row justify-around w-full mt-3 mb-3 ">
      <Badge variant={booktype=='novel'? 'destructive': 'secondary'} onClick={() => handleTypeClick('novel')} className="p-2">Novel</Badge>
      <Badge variant={booktype=='manga'? 'destructive': 'secondary'} onClick={() => handleTypeClick('manga')} className="p-2">Manga</Badge>
      <Badge variant={booktype=='comic'? 'destructive': 'secondary'} onClick={() => handleTypeClick('comic')} className="p-2">Comic</Badge>
      <Badge variant={booktype==''? 'destructive': 'secondary'} onClick={() => handleTypeClick('')} className="p-2">All</Badge>
    </div>
  );
}

export {TypesButtons};
