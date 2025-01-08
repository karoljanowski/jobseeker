import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOfferColor } from "@/lib/actions/singleOffer"
import { Loader2 } from "lucide-react"
import { startTransition, useActionState, useEffect } from "react"
import toast from "react-hot-toast"

const colors = [
    {
        name: 'Slate',
        value: '#020617'
    },
    {
        name: 'Gray',
        value: '#111827'
    },
    {
        name: 'Zinc',
        value: '#09090B'
    },
    {
        name: 'gray',
        value: '#171717'
    },
    {
        name: 'Stone',
        value: '#1C1917'
    },
    {
        name: 'Red',
        value: '#7F1D1D'
    },
    {
        name: 'Orange',
        value: '#7C2D12'
    },
    {
        name: 'Amber',
        value: '#78350F'
    },
    {
        name: 'Yellow',
        value: '#713F12'
    },
    {
        name: 'Lime',
        value: '#365314'
    },
    {
        name: 'Green',
        value: '#14532D'
    },
    {
        name: 'Emerald',
        value: '#064E3B'
    },
    {
        name: 'Teal',
        value: '#134E4A'
    },
    {
        name: 'Cyan',
        value: '#164E63'
    },
    {
        name: 'Sky',
        value: '#0C4A6E'
    },
    {
        name: 'Blue',
        value: '#1E3A8A'
    },
    {
        name: 'Indigo',
        value: '#312E81'
    },
    {
        name: 'Violet',
        value: '#4C1D95'
    },
    {
        name: 'Purple',
        value: '#581C87'
    },
    {
        name: 'Fuchsia',
        value: '#701A75'
    },
    {
        name: 'Pink',
        value: '#831843'
    },
    {
        name: 'Rose',
        value: '#881337'
    }
]

const ColorPicker = ({ offerId, value }: { offerId: number, value: string }) => {
    const [state, dispatch, pending] = useActionState(updateOfferColor, { color: value, success: false, error: null })

    const handleChange = (color: string) => {
        startTransition(() => {
            dispatch({ offerId, color })
        })
    }

    useEffect(() => {
        if (state.success) {
            toast.success('Color updated successfully')
        }else if (state.error) {
            toast.error(state.error)
        }
    }, [state.success, state.error])

    return (
        <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-sm">Color</span>
            <Select value={state.color} onValueChange={handleChange}>
                <SelectTrigger className="bg-gray-800 hover:bg-gray-700 transition-colors border-none focus:ring-offset-0 mt-0 focus:ring-0">
                    {pending ? 
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                        </div> : 
                        <SelectValue placeholder="Select a color" />}
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-none">
                    {colors.map((color) => (
                        <SelectItem key={color.name} value={color.value} className="cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-4 rounded-full" style={{ backgroundColor: color.value }}/>
                                <span>{color.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default ColorPicker