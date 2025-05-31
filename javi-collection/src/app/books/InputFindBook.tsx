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
        <Input placeholder="Search for book" className="w-250 m-auto mt-3 bg-[var(--color-inputs)] placeholder-[var(--color-redtext)]" onChange={findBook} ></Input>
        </>
    )
}

export {FindButtons}
