'use client';
import { useState } from 'react';
import { ChevronLeft, Settings, Plus, Layers, ArrowRight } from 'lucide-react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LeftSideBar from './components/LeftSideBar';
import FormContent from './components/FormContent';
import RightPanel from './components/RightPanel';

export default function Home() {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [formElements, setFormElements] = useState<{ type: string; label: string }[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);

  const handleElementSelect = (index: number) => {
    setSelectedElement(index);
  };


  return (
    <div className="bg-neutral-light min-h-screen">
      {/* Navbar */}
      <div className="bg-primary text-white py-3 px-6 shadow-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          {/* <Menu className="h-5 w-5 cursor-pointer" /> */}
          <span className="font-bold text-lg">Form Editor</span>
        </div>
        <div className="flex items-center space-x-6">
          {/* <div className="relative flex items-center">
            <Search className="h-4 w-4 absolute left-3 text-white/60" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-primary-dark pl-9 pr-4 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-60"
            />
          </div> */}

          {/* <BellRing className="h-5 w-5 cursor-pointer" />
          <div className="flex items-center space-x-2 border-l border-primary-dark pl-4">
            <div className="bg-primary-dark p-1.5 rounded-full">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </div> */}
        </div>
      </div>

      {/* Main Layout */}
      <div className="p-4">
        {/* <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-colors shadow-button hover:shadow-hover">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div> */}
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
            {/* Left Sidebar - Elements */}

            <div className={`bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 ${isCollapsed ? 'col-span-1' : 'col-span-2'}`}>
              <LeftSideBar isCollapsed={isCollapsed} />
            </div>

            {/* Main Content - Form Builder */}
            <div className="bg-white rounded-sm shadow-card p-4 col-span-7 overflow-auto flex flex-col">
              <FormContent
                formElements={formElements}
                setFormElements={setFormElements}
                selectedElement={selectedElement}
                onSelectElement={handleElementSelect}
              />
            </div>

            {/* Right Sidebar - Properties */}
            <div className="bg-white rounded-sm shadow-card col-span-3 overflow-auto">
              <RightPanel
                selectedElement={formElements[selectedElement!]} // Pass selected element
                setFormElements={setFormElements}
                selectedIndex={selectedElement}
              />
            </div>


          </div>
        </DndProvider>
      </div>

    </div>
  );
}