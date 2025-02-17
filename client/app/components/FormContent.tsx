'use client';
import { Layers, Plus, Grip, Settings, Trash2, Copy, Eye } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { useState } from 'react';
import DraggableElement from './DraggableElement'; // Import DraggableElement

type FormElementColors = {
    text: string;
    textarea: string;
    dropdown: string;
    checkbox: string;
    radio: string;
    date: string;
    number: string;
    email: string;
    file: string;
};
const getElementColor = (type: string): string => {
    const colors: Record<string, string> = {
        'text': 'bg-primary/20', 'textarea': 'bg-primary/20', 'dropdown': 'bg-accent-info/20',
        'checkbox': 'bg-accent-purple/20', 'radio': 'bg-secondary/20', 'date': 'bg-accent-pink/20',
        'number': 'bg-accent-warning/20', 'email': 'bg-accent-success/20', 'file': 'bg-accent-error/20'
    };
    return colors[type] || 'bg-neutral-muted';
};



export default function FormContent() {

    const [hoveredElement, setHoveredElement] = useState<number | null>(null);

    const [formElements, setFormElements] = useState<{ type: string; label: string }[]>([]); // State to store dropped elements

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: "FORM_ELEMENT", // Accept elements of this type
        drop: (item) => {
            setFormElements((prevElements: any) => [...prevElements, item]); // Add dropped item to the form state
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const removeElement = (index: number) => {
        // Filter out the element at the given index
        setFormElements((prevElements) => prevElements.filter((_, i) => i !== index));
      };
      

    return (
        <div
            ref={dropRef as any}
            className={`bg-white rounded-lg transition-all overflow-hidden h-full ${isOver
                    ? "border-2 border-primary border-solid bg-primary/5"
                    : formElements.length === 0
                        ? "border border-dashed border-neutral-muted bg-neutral-light"
                        : "border border-neutral-dark"
                }`}
        >
            {formElements.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-5">
                    <div className="bg-neutral-light p-2 rounded-full mb-3">
                        <Layers className="h-6 w-6 text-primary/60" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-text mb-2">Your form is empty</h3>
                    <p className="text-neutral-muted text-center max-w-xs mb-3 text-xs">
                        Drag elements from the left panel to start building your form.
                    </p>
                    <button className="bg-primary hover:bg-primary-hover text-white py-1.5 px-4 rounded text-sm shadow-sm hover:shadow transition-all flex items-center space-x-1">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Element</span>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {/* Form Title - Compact */}
                    <div className="border-b border-neutral-dark/20 py-2 px-3">
                        <input
                            type="text"
                            placeholder="Untitled Form"
                            className="text-base font-medium text-neutral-text bg-transparent border-none outline-none w-full p-0.5"
                        />
                        <p className="text-neutral-muted text-xs">
                            Created on Feb 18, 2025 • {formElements.length} elements
                        </p>
                    </div>

                    {/* Form Elements - Maximum visibility */}
                    <div className="flex-grow overflow-y-auto">
                        <div className="p-2 space-y-0.5">
                            {formElements.map((element, index) => (
                                <div
                                    key={index}
                                    className={`relative border rounded transition-all ${hoveredElement === index
                                            ? "border-primary bg-primary/5"
                                            : "border-neutral-dark/10 hover:border-primary/30"
                                        }`}
                                    onMouseEnter={() => setHoveredElement(index)}
                                    onMouseLeave={() => setHoveredElement(null)}
                                >
                                    {/* Element Content - Compact */}
                                    <div className="py-1.5 px-2 flex items-center justify-between">
                                        <DraggableElement
                                            type={element.type}
                                            label={element.label}
                                            bgColor="bg-white"
                                            borderColor="border-neutral-muted"
                                            iconColor={getElementColor(element.type)}
                                        />

                                        {/* Always visible delete button, but subtle until hover */}
                                        <button
                                            onClick={() => removeElement(index)}
                                            className={`p-0.5 rounded ${hoveredElement === index
                                                    ? "text-accent-error"
                                                    : "text-neutral-muted opacity-60"
                                                }`}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Footer - Compact */}
                    <div className="bg-neutral-light py-1.5 px-3 border-t border-neutral-dark/20 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <button className="bg-white text-neutral-text py-1 px-2 rounded text-xs border border-neutral-dark/20 hover:border-primary">
                                <Eye className="h-3.5 w-3.5 inline-block mr-1" />
                                Preview
                            </button>
                            <button className="bg-white text-neutral-text py-1 px-2 rounded text-xs border border-neutral-dark/20 hover:border-primary">
                                <Settings className="h-3.5 w-3.5 inline-block mr-1" />
                                Settings
                            </button>
                        </div>
                        <button className="text-xs text-primary hover:underline">
                            + Add Element
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
