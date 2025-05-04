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
    <>
      <Badge variant={booktype=='novel'? 'outline': 'secondary'} onClick={() => handleTypeClick('novel')}>Novel</Badge>
      <Badge variant={booktype=='manga'? 'outline': 'secondary'} onClick={() => handleTypeClick('manga')}>Manga</Badge>
      <Badge variant={booktype=='comic'? 'outline': 'secondary'} onClick={() => handleTypeClick('comic')}>Comic</Badge>
      <Badge variant={booktype==''? 'outline': 'secondary'} onClick={() => handleTypeClick('')}>All</Badge>
    </>
  );
}

export {TypesButtons};
