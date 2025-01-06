import { cn } from "@/lib/utils";
import { Input } from "./input"
import { Label } from "./label"

interface LabelInputProps {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    className?: string;
    errors: any;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LabelInput = ({name, label, placeholder, type, required, className = 'bg-gray-900 border-gray-800', errors, value, onChange}: LabelInputProps) => {
    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={name} className="text-sm">{label}</Label>
            <Input
                id={name}
                name={name}
                placeholder={placeholder}
                type={type}
                required={required}
                className={cn(className, 'bg-gray-800 border-none')}
                value={value}
                onChange={onChange}
            />
            {errors && <p className="text-sm text-red-500">{errors}</p>}
        </div>
    )
}

export default LabelInput