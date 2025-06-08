import { Input } from "@/components/ui/input";
interface NameProps {
    setname: (name: string) => void;
  }

const Find: React.FC<NameProps> = ({ setname }) => {

    const find = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.value;
        setname(inputName);
    }

    return(
        <>
        <Input placeholder="Search for book" className="w-250 m-auto mt-3 bg-[var(--color-inputs)] placeholder-[var(--color-redtext)]" onChange={find} ></Input>
        </>
    )
}

export {Find}
