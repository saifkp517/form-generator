'use client';

import { Settings, Plus, Layers } from 'lucide-react';
import DraggableElement from './DraggableElement';

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
                    <>
                        <DraggableElement type="text" label="Text Input" bgColor="bg-primary-light" borderColor="border-primary/20" iconColor="bg-primary/20" />
                        <DraggableElement type="dropdown" label="Dropdown" bgColor="bg-accent-info/10 hover:bg-accent-info/15" borderColor="border-accent-info/20" iconColor="bg-accent-info/20" />
                        <DraggableElement type="checkbox" label="Checkboxes" bgColor="bg-accent-purple/10 hover:bg-accent-purple/15" borderColor="border-accent-purple/20" iconColor="bg-accent-purple/20" />
                        <DraggableElement type="radio" label="Radio Buttons" bgColor="bg-secondary/10 hover:bg-secondary/15" borderColor="border-secondary/20" iconColor="bg-secondary/20" />
                        <DraggableElement type="date" label="Date Picker" bgColor="bg-accent-pink/10 hover:bg-accent-pink/15" borderColor="border-accent-pink/20" iconColor="bg-accent-pink/20" />
                    </>
                )}
            </div>
        </div>
    );
};

export default FormSidebar;
