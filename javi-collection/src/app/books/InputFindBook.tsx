import { Input } from "@/components/ui/input";

interface NameBooksProps {
    setbookname: (bookname: string) => void;
  }

const FindButtons: React.FC<NameBooksProps> = ({ setbookname }) => {

    const findBook = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputNameBook = event.target.value;
        setbookname(inputNameBook);
    }

    return(
        <>
        <Input placeholder="Find a book" className="w-50" onChange={findBook}></Input>
        </>
    )
}

export {FindButtons}
