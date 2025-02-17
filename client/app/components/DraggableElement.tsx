
import { useDrag } from 'react-dnd';
import { ChevronLeft, Settings, Plus, Layers } from 'lucide-react';
import { useState } from 'react';

const DRAGGABLE_TYPE = 'FORM_ELEMENT';

const DraggableElement: React.FC<{ type: string; label: string; bgColor: string; borderColor: string; iconColor: string }> = ({ type, label, bgColor, borderColor, iconColor }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: DRAGGABLE_TYPE,
        item: { type, label },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={dragRef as any}
            className={`p-2.5 rounded-sm cursor-pointer transition-colors flex items-center space-x-3 border ${borderColor} ${bgColor} hover:opacity-75`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className={`${iconColor} p-1 rounded`}>
                <Plus className="h-4 w-4" />
            </div>
            <span className="text-neutral-text font-medium">{label}</span>
        </div>
    );
};

export default DraggableElement;