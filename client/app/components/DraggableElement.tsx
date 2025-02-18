import { useDrag } from "react-dnd";
import { Plus, Text, List, CheckSquare, Calendar, Hash, Mail } from "lucide-react";
import { LucideIcon } from "lucide-react";

const DRAGGABLE_TYPE = "FORM_ELEMENT";

// Define a type for form element keys
type FormElementType = "text" | "dropdown" | "checkbox" | "date" | "number" | "email";

// Define a mapping of form elements to icons
const ICON_MAP: Record<FormElementType, LucideIcon> = {
    text: Text,
    dropdown: List,
    checkbox: CheckSquare,
    date: Calendar,
    number: Hash,
    email: Mail,
};

const DraggableElement: React.FC<{ type: string; label: string; bgColor: string; borderColor: string; iconColor: string }> = ({
    type,
    label,
    bgColor,
    borderColor,
    iconColor,
}) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: DRAGGABLE_TYPE,
        item: { type, label },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    // Ensure type safety for icons
    const Icon = (ICON_MAP[type as FormElementType] || Plus) as LucideIcon;

    return (
        <div
            ref={dragRef as any}
            className={`p-2.5 rounded-sm cursor-pointer transition-colors flex items-center space-x-3 border ${borderColor} ${bgColor} hover:opacity-75`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className={`${iconColor} p-1 rounded`}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-neutral-text font-medium">{label}</span>
        </div>
    );
};

export default DraggableElement;
