'use client';

import { Settings, Plus, Layers } from 'lucide-react';
import DraggableElement from './DraggableElement';
import { getIcon } from './utils/FormElements';

// Draggable Form Element Component
interface FormSidebarProps {
    isCollapsed: boolean;
}

// Form Sidebar Component
const FormSidebar: React.FC<FormSidebarProps> = ({ isCollapsed }) => {
    return (
        <div className="p-3">
            {!isCollapsed && <p className="text-sm text-neutral-muted mb-3">Drag and drop elements to build your form</p>}

            <div className="space-y-3">
                {isCollapsed ? (
                    <div className="flex flex-col items-center space-y-4 pt-4">
                        <Plus className="h-5 w-5 text-primary cursor-pointer hover:text-primary-hover" />
                        <Layers className="h-5 w-5 text-primary cursor-pointer hover:text-primary-hover" />
                        <Settings className="h-5 w-5 text-primary cursor-pointer hover:text-primary-hover" />
                    </div>
                ) : (
                    <div className="max-h-[500px] overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
                        {/* Text Inputs */}
                        <DraggableElement type="text" label="Text Input" bgColor="bg-primary-light" borderColor="border-primary/20" iconColor="bg-primary/20" />
                        <DraggableElement type="textarea" label="Text Area" bgColor="bg-primary-light" borderColor="border-primary/20" iconColor="bg-primary/20" />

                        {/* Selection Inputs */}
                        <DraggableElement type="dropdown" label="Dropdown" bgColor="bg-accent-info/10 hover:bg-accent-info/15" borderColor="border-accent-info/20" iconColor="bg-accent-info/20" />
                        <DraggableElement type="checkbox" label="Checkboxes" bgColor="bg-accent-purple/10 hover:bg-accent-purple/15" borderColor="border-accent-purple/20" iconColor="bg-accent-purple/20" />
                        <DraggableElement type="radio" label="Radio Buttons" bgColor="bg-secondary/10 hover:bg-secondary/15" borderColor="border-secondary/20" iconColor="bg-secondary/20" />
                        <DraggableElement type="list" label="List Selection" bgColor="bg-accent-info/10 hover:bg-accent-info/15" borderColor="border-accent-info/20" iconColor="bg-accent-info/20" />

                        {/* Date & Time Inputs */}
                        <DraggableElement type="date" label="Date Picker" bgColor="bg-accent-pink/10 hover:bg-accent-pink/15" borderColor="border-accent-pink/20" iconColor="bg-accent-pink/20" />
                        <DraggableElement type="time" label="Time Picker" bgColor="bg-accent-warning/10 hover:bg-accent-warning/15" borderColor="border-accent-warning/20" iconColor="bg-accent-warning/20" />

                        {/* Specialized Inputs */}
                        <DraggableElement type="number" label="Number Input" bgColor="bg-accent-warning/10 hover:bg-accent-warning/15" borderColor="border-accent-warning/20" iconColor="bg-accent-warning/20" />
                        <DraggableElement type="email" label="Email Input" bgColor="bg-accent-success/10 hover:bg-accent-success/15" borderColor="border-accent-success/20" iconColor="bg-accent-success/20" />
                        <DraggableElement type="phone" label="Phone Input" bgColor="bg-accent-info/10 hover:bg-accent-info/15" borderColor="border-accent-info/20" iconColor="bg-accent-info/20" />
                        <DraggableElement type="url" label="URL Input" bgColor="bg-accent-info/10 hover:bg-accent-info/15" borderColor="border-accent-info/20" iconColor="bg-accent-info/20" />
                        <DraggableElement type="file" label="File Upload" bgColor="bg-accent-error/10 hover:bg-accent-error/15" borderColor="border-accent-error/20" iconColor="bg-accent-error/20" />

                        {/* Complex Fields */}
                        <DraggableElement type="address" label="Address Input" bgColor="bg-accent-success/10 hover:bg-accent-success/15" borderColor="border-accent-success/20" iconColor="bg-accent-success/20" />
                        <DraggableElement type="payment" label="Payment Input" bgColor="bg-accent-error/10 hover:bg-accent-error/15" borderColor="border-accent-error/20" iconColor="bg-accent-error/20" />
                        <DraggableElement type="user" label="User Info" bgColor="bg-accent-purple/10 hover:bg-accent-purple/15" borderColor="border-accent-purple/20" iconColor="bg-accent-purple/20" />
                        <DraggableElement type="document" label="Document Upload" bgColor="bg-primary-light" borderColor="border-primary/20" iconColor="bg-primary/20" />

                        {/* Add New Field */}
                        <DraggableElement type="add" label="Add Field" bgColor="bg-primary-light" borderColor="border-primary/20" iconColor="bg-primary/20" />
                    </div>

                )}
            </div>
        </div>
    );
};

export default FormSidebar;
