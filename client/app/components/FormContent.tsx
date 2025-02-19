'use client';
import { Layers, Settings, Trash2, Eye, Search, ChevronDown } from 'lucide-react';
import { getIcon, getElementColor } from './utils/FormElements';
import { useDrop, useDrag } from 'react-dnd';
import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import DraggableElement from './DraggableElement';
import { JSX } from 'react/jsx-runtime';

type FormElement = {
    field_name: string;
    type: string;
};

const mapFormType = (type: string): string => {
    const typeMap: Record<string, string> = {
        'single_line': 'text',
        'textarea': 'textarea',
        'dropdown': 'dropdown',
        'radio_buttons': 'radio',
        'date': 'date',
        'number': 'number',
        'email': 'email',
        'file_upload': 'file',
        'address': 'text',
        'phone': 'text',
        'url': 'text',
        'time': 'time'
    };
    return typeMap[type] || 'text';
};


export default function FormContent({ setFormElements, selectedElement, onSelectElement }: any) {
    const [hoveredElement, setHoveredElement] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<FormElement[][]>([[]]);
    const [currentVersion, setCurrentVersion] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [formElements, setLocalFormElements] = useState<FormElement[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
    const elementsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://127.0.0.1:4000/api/data');

                const mappedElements = response.data.map((element: FormElement) => ({
                    ...element,
                    type: mapFormType(element.type),
                    label: element.field_name
                }));
                setLocalFormElements(mappedElements);
                setFormElements(mappedElements);

                updateHistory([...mappedElements]);
                
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch form fields');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormFields();
    }, [setFormElements]);


    const updateHistory = (newElements: FormElement[]) => {
        const newHistory = history.slice(0, currentVersion + 1);
        newHistory.push(newElements);
        setHistory(newHistory)
        setCurrentVersion(newHistory.length - 1);
    }
 
    const undoChange = () => {
        console.log("undo change called");
        console.log(currentVersion)
        if (currentVersion > 1) {
            const prevVersion = currentVersion - 1;
            setLocalFormElements(history[prevVersion]);
            setFormElements(history[prevVersion]);
            setCurrentVersion(prevVersion);
        }
    }

    const saveChanges = () => {
        setHistory(history.slice(0, currentVersion + 1)); // Clear future versions
    };

    // Determine drop position based on mouse coordinates
    const getDropIndex = (monitor: any) => {
        if (!elementsContainerRef.current) return formElements.length;

        const containerRect = elementsContainerRef.current.getBoundingClientRect();
        const y = monitor.getClientOffset().y - containerRect.top;

        const elementNodes = Array.from(elementsContainerRef.current.querySelectorAll('.form-element-row'));

        for (let i = 0; i < elementNodes.length; i++) {
            const rect = elementNodes[i].getBoundingClientRect();
            const elementMiddle = rect.top + rect.height / 2 - containerRect.top;

            if (y < elementMiddle) {
                return i;
            }
        }

        return elementNodes.length;
    };

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: "FORM_ELEMENT",
        hover: (item, monitor) => {
            const dropIndex = getDropIndex(monitor);
            setDropTargetIndex(dropIndex);
        },
        drop: (item: any, monitor) => {
            const dropIndex = getDropIndex(monitor);

            // Create a new array by inserting the new element at the specific index
            const updatedElements = [...formElements];
            updatedElements.splice(dropIndex, 0, item);

            setLocalFormElements(updatedElements);
            setFormElements(updatedElements);
            updateHistory(updatedElements);
            setDropTargetIndex(null);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }), [formElements]);

    // Reset drop target when drag ends
    useEffect(() => {
        if (!isOver) {
            setDropTargetIndex(null);
        }
    }, [isOver]);

    const removeElement = (index: number) => {
        setLocalFormElements((prevElements) => prevElements.filter((_, i) => i !== index));
        setFormElements((prevElements: any) => prevElements.filter((_: any, i: number) => i !== index));

        const updatedElements = [...formElements];
        updateHistory(updatedElements);
    };

    // Move element to a new position (for drag reordering)
    const moveElement = (dragIndex: number, hoverIndex: number) => {
        const draggedElement = formElements[dragIndex];
        const updatedElements = [...formElements];

        // Remove the element from its original position
        updatedElements.splice(dragIndex, 1);
        // Insert it at the new position
        updatedElements.splice(hoverIndex, 0, draggedElement);

        setLocalFormElements(updatedElements);
        setFormElements(updatedElements);
    };

    const elementsByType = useMemo(() => {
        const groups: Record<string, FormElement[]> = {};
        formElements.forEach((element) => {
            if (!groups[element.type]) groups[element.type] = [];
            groups[element.type].push(element);
        });
        return groups;
    }, [formElements]);

    const filteredElements = useMemo(() => {
        if (!searchTerm) return formElements;
        return formElements.filter(element =>
            element.field_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [formElements, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-accent-error text-center">
                    <p className="text-sm font-semibold">Error loading form fields</p>
                    <p className="text-xs">{error}</p>
                </div>
            </div>
        );
    }

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
                <div className="flex flex-col items-center justify-center p-3">
                    <div className="bg-neutral-light p-1.5 rounded-full mb-2">
                        <Layers className="h-5 w-5 text-primary/60" />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-text mb-1">Your form is empty</h3>
                    <p className="text-neutral-muted text-center max-w-xs mb-2 text-xs">
                        Drag elements from the sidebar to build your form
                    </p>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="border-b border-neutral-dark/20 p-2">
                        <div className="flex items-center justify-between mb-2">
                            <input
                                type="text"
                                placeholder="Construction Project Application"
                                className="text-sm font-medium text-neutral-text bg-transparent border-none outline-none w-3/4 p-0.5"
                            />
                            <span className="text-xs text-neutral-muted">{formElements.length} elements</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-muted" />
                                <input
                                    type="text"
                                    placeholder="Search fields..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="py-1.5 pl-8 pr-2 text-sm w-full border border-neutral-dark/20 rounded-md"
                                />
                            </div>
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="px-3 py-1.5 text-sm border border-neutral-dark text-neutral-muted rounded-md hover:bg-neutral-light"
                            >
                                {isCollapsed ? 'Expand' : 'Collapse'}
                            </button>
                            <button
                                onClick={undoChange}
                                disabled={currentVersion === 0}
                                className="px-3 py-1.5 text-sm border border-neutral-dark text-neutral-muted rounded-md hover:bg-neutral-light"
                            >
                                Undo
                            </button>

                            <button
                                onClick={saveChanges} 
                                className="px-3 py-1.5 text-sm border bg-accent-purple text-neutral-light rounded-md hover:bg-accent-purple/80"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto" ref={elementsContainerRef}>
                        {isCollapsed ? (
                            <div className="p-2 space-y-1">
                                {Object.entries(elementsByType).map(([type, elements]) => (
                                    <div key={type} className="border border-neutral-dark/10 rounded-md overflow-hidden">
                                        <div
                                            className="bg-neutral-light py-2 px-3 flex items-center justify-between cursor-pointer hover:bg-neutral-light/80"
                                            onClick={() => setActiveSection(activeSection === type ? null : type)}
                                        >
                                            <div className="flex items-center gap-2 text-neutral-text">
                                                {getIcon(type)}
                                                <span className="text-sm font-medium capitalize">{type}</span>
                                                <span className="text-xs text-primary-dark">({elements.length})</span>
                                            </div>
                                            <ChevronDown className={`h-4 w-4 transition-transform ${activeSection === type ? 'transform rotate-180' : ''}`} />
                                        </div>
                                        {activeSection === type && (
                                            <div className="p-1 space-y-1 max-h-48 overflow-y-auto">
                                                {elements.map((element: any, subIndex: number) => {
                                                    const elementIndex = formElements.findIndex(e => e === element);
                                                    return (
                                                        <div key={`${type}-${subIndex}`}>
                                                            {dropTargetIndex === elementIndex && (
                                                                <DropIndicator />
                                                            )}
                                                            <ElementRow
                                                                element={element}
                                                                index={elementIndex}
                                                                hoveredElement={hoveredElement}
                                                                setHoveredElement={setHoveredElement}
                                                                onSelectElement={onSelectElement}
                                                                removeElement={removeElement}
                                                                getTypeIcon={getIcon}
                                                                getElementColor={getElementColor}
                                                                moveElement={moveElement}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                                {dropTargetIndex === elements.length && activeSection === type && (
                                                    <DropIndicator />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {filteredElements.map((element: any, index: number) => (
                                    <div key={index} className="form-element-container">
                                        {dropTargetIndex === index && (
                                            <DropIndicator />
                                        )}
                                        <ElementRow
                                            element={element}
                                            index={index}
                                            hoveredElement={hoveredElement}
                                            setHoveredElement={setHoveredElement}
                                            onSelectElement={onSelectElement}
                                            removeElement={removeElement}
                                            getTypeIcon={getIcon}
                                            getElementColor={getElementColor}
                                            moveElement={moveElement}
                                            className="form-element-row"
                                        />
                                    </div>
                                ))}
                                {dropTargetIndex === filteredElements.length && (
                                    <DropIndicator />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-neutral-light p-2 border-t border-neutral-dark/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="bg-white text-neutral-text py-1.5 px-3 rounded-md text-sm border border-neutral-dark/20 hover:border-primary flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                Preview
                            </button>
                            <button className="bg-white text-neutral-text py-1.5 px-3 rounded-md text-sm border border-neutral-dark/20 hover:border-primary flex items-center gap-1">
                                <Settings className="h-4 w-4" />
                                Settings
                            </button>
                        </div>
                        <button className="text-sm text-primary hover:underline">
                            + Add Field
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Visual indicator for drop position
function DropIndicator() {
    return (
        <div className="h-1 w-full bg-primary rounded-full my-1 animate-pulse" />
    );
}

function ElementRow({
    element,
    index,
    hoveredElement,
    setHoveredElement,
    onSelectElement,
    removeElement,
    getTypeIcon,
    getElementColor,
    moveElement,
    className = ''
}: {
    element: any;
    index: number;
    hoveredElement: number | null;
    setHoveredElement: (index: number | null) => void;
    onSelectElement: (index: number) => void;
    removeElement: (index: number) => void;
    getTypeIcon: (type: string) => JSX.Element;
    getElementColor: (type: string) => string;
    moveElement?: (dragIndex: number, hoverIndex: number) => void;
    className?: string;
}) {
    // Add useDrag and useDrop for reordering within the form
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'FORM_ELEMENT_REORDER',
        item: () => {
            return { index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ handlerId }, drop] = useDrop({
        accept: 'FORM_ELEMENT_REORDER',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveElement && moveElement(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    // Initialize drag and drop refs
    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`relative rounded-md transition-all ${getElementColor(element.type)} ${hoveredElement === index
                    ? "ring-2 ring-primary ring-opacity-50"
                    : "hover:ring-1 hover:ring-primary hover:ring-opacity-30"
                } ${isDragging ? 'opacity-50' : 'opacity-100'} ${className}`}
            onClick={() => onSelectElement(index)}
            onMouseEnter={() => setHoveredElement(index)}
            onMouseLeave={() => setHoveredElement(null)}
            data-handler-id={handlerId}
        >
            <div className="py-2 px-3 flex items-center justify-between cursor-move">
                <div className="flex items-center gap-2 overflow-hidden text-neutral-muted">
                    <div className="flex-shrink-0">
                        {getTypeIcon(element.type)}
                    </div>
                    <span className="text-sm truncate" title={element.field_name}>
                        {element.field_name}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeElement(index);
                    }}
                    className={`p-1 rounded-md transition-colors ${hoveredElement === index
                            ? "text-accent-error hover:bg-accent-error/10"
                            : "text-neutral-muted opacity-60 hover:opacity-100 hover:bg-neutral-light"
                        }`}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}