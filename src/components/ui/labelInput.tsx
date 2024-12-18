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

const LabelInput = ({name, label, placeholder, type, required, className = 'bg-neutral-900 border-neutral-800', errors, value, onChange}: LabelInputProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                placeholder={placeholder}
                type={type}
                required={required}
                className={className}
                value={value}
                onChange={onChange}
            />
            {errors && <p className="text-sm text-red-500">{errors}</p>}
        </div>
    )
}

export default LabelInput