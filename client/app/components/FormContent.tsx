'use client';
import { Layers, Settings, Trash2, Eye, Search, ChevronDown } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { useState, useEffect, useMemo } from 'react';
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

// Enhanced type icons mapping
const getTypeIcon = (type: string) => {
    const iconMap: Record<string, JSX.Element> = {
        'text': <span className="text-primary text-xs font-mono">Aa</span>,
        'textarea': <span className="text-primary text-xs font-mono">¶</span>,
        'dropdown': <ChevronDown className="h-4 w-4 text-accent-info" />,
        'radio': <span className="h-3.5 w-3.5 rounded-full border-2 border-secondary" />,
        'date': <span className="text-accent-pink font-mono text-xs">📅</span>,
        'number': <span className="text-accent-warning font-mono text-xs">#</span>,
        'email': <span className="text-accent-success font-mono text-xs">@</span>,
        'file': <span className="text-accent-error font-mono text-xs">📎</span>,
        'time': <span className="text-accent-warning font-mono text-xs">⏰</span>
    };
    return iconMap[type] || <span className="text-neutral-muted text-xs">?</span>;
};

const getElementColor = (type: string): string => {
    const colors: Record<string, string> = {
        'text': 'bg-primary/10 border-primary/30',
        'textarea': 'bg-primary/5 border-primary/20',
        'dropdown': 'bg-accent-info/10 border-accent-info/30',
        'radio': 'bg-secondary/10 border-secondary/30',
        'date': 'bg-accent-pink/10 border-accent-pink/30',
        'number': 'bg-accent-warning/10 border-accent-warning/30',
        'email': 'bg-accent-success/10 border-accent-success/30',
        'file': 'bg-accent-error/10 border-accent-error/30',
        'time': 'bg-accent-warning/10 border-accent-warning/30'
    };
    return colors[type] || 'bg-neutral-light border-neutral-muted';
};

export default function FormContent({ setFormElements, selectedElement, onSelectElement }: any) {
    const [hoveredElement, setHoveredElement] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formElements, setLocalFormElements] = useState<FormElement[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);

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
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch form fields');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormFields();
    }, [setFormElements]);

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: "FORM_ELEMENT",
        drop: (item) => {
            setLocalFormElements((prevElements: any) => [...prevElements, item]);
            setFormElements((prevElements: any) => [...prevElements, item]);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const removeElement = (index: number) => {
        setLocalFormElements((prevElements) => prevElements.filter((_, i) => i !== index));
        setFormElements((prevElements: any) => prevElements.filter((_: any, i: number) => i !== index));
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
            className={`bg-white rounded-lg transition-all overflow-hidden h-full ${
                isOver
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
                        Loading form elements from API...
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
                                className="px-3 py-1.5 text-sm border border-neutral-dark/20 rounded-md hover:bg-neutral-light"
                            >
                                {isCollapsed ? 'Expand' : 'Collapse'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        {isCollapsed ? (
                            <div className="p-2 space-y-1">
                                {Object.entries(elementsByType).map(([type, elements]) => (
                                    <div key={type} className="border border-neutral-dark/10 rounded-md overflow-hidden">
                                        <div 
                                            className="bg-neutral-light py-2 px-3 flex items-center justify-between cursor-pointer hover:bg-neutral-light/80"
                                            onClick={() => setActiveSection(activeSection === type ? null : type)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(type)}
                                                <span className="text-sm font-medium capitalize">{type}</span>
                                                <span className="text-xs text-primary-dark">({elements.length})</span>
                                            </div>
                                            <ChevronDown className={`h-4 w-4 transition-transform ${activeSection === type ? 'transform rotate-180' : ''}`} />
                                        </div>
                                        {activeSection === type && (
                                            <div className="p-1 space-y-1 max-h-48 overflow-y-auto">
                                                {elements.map((element: any, subIndex: number) => (
                                                    <ElementRow
                                                        key={subIndex}
                                                        element={element}
                                                        index={formElements.findIndex(e => e === element)}
                                                        hoveredElement={hoveredElement}
                                                        setHoveredElement={setHoveredElement}
                                                        onSelectElement={onSelectElement}
                                                        removeElement={removeElement}
                                                        getTypeIcon={getTypeIcon}
                                                        getElementColor={getElementColor}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {filteredElements.map((element: any, index: number) => (
                                    <ElementRow
                                        key={index}
                                        element={element}
                                        index={index}
                                        hoveredElement={hoveredElement}
                                        setHoveredElement={setHoveredElement}
                                        onSelectElement={onSelectElement}
                                        removeElement={removeElement}
                                        getTypeIcon={getTypeIcon}
                                        getElementColor={getElementColor}
                                    />
                                ))}
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

function ElementRow({ 
    element, 
    index, 
    hoveredElement, 
    setHoveredElement, 
    onSelectElement, 
    removeElement,
    getTypeIcon,
    getElementColor
}: {
    element: any;
    index: number;
    hoveredElement: number | null;
    setHoveredElement: (index: number | null) => void;
    onSelectElement: (index: number) => void;
    removeElement: (index: number) => void;
    getTypeIcon: (type: string) => JSX.Element;
    getElementColor: (type: string) => string;
}) {
    return (
        <div
            className={`relative rounded-md transition-all ${getElementColor(element.type)} ${
                hoveredElement === index
                    ? "ring-2 ring-primary ring-opacity-50"
                    : "hover:ring-1 hover:ring-primary hover:ring-opacity-30"
            }`}
            onClick={() => onSelectElement(index)}
            onMouseEnter={() => setHoveredElement(index)}
            onMouseLeave={() => setHoveredElement(null)}
        >
            <div className="py-2 px-3 flex items-center justify-between">
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
                    className={`p-1 rounded-md transition-colors ${
                        hoveredElement === index
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