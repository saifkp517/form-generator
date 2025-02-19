import { useDrag } from "react-dnd";
import { getIcon } from "./utils/FormElements";

const DRAGGABLE_TYPE = "FORM_ELEMENT";


const DraggableElement: React.FC<{ type: string; label: string; bgColor: string; borderColor: string; iconColor: string }> = ({
    type,
    label,
    bgColor,
    borderColor,
    iconColor,
}) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: DRAGGABLE_TYPE,
        item: {
            type,
            field_name: label,
            label: label,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={dragRef as any}
            className={`${bgColor} ${borderColor} border rounded-md p-2 cursor-move transition-all ${
                isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:shadow-sm hover:translate-y-[-2px]'
            }`}
        >
            <div className="flex items-center gap-2">
                <div className={`${iconColor} p-1 rounded-md`}>
                    {getIcon(type)}
                </div>
                <span className="text-sm text-neutral-muted">{label}</span>
            </div>
        </div>
    );
};

export default DraggableElement;
