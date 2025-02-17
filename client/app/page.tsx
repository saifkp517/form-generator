'use client';
import { useState } from 'react';
import { ChevronLeft, Settings, Plus, Layers, ArrowRight } from 'lucide-react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LeftSideBar from './components/LeftSideBar';
import FormContent from './components/FormContent';

export default function Home() {

  const [isCollapsed, setIsCollapsed] = useState(false);


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
              <FormContent />
            </div>

            {/* Right Sidebar - Properties */}
            <div className="bg-white rounded-sm shadow-card col-span-3 overflow-auto">
              <div className="p-3 bg-primary text-white">
                <h3 className="font-medium">Element Properties</h3>
              </div>

              <div className="p-4">
                <p className="text-sm text-neutral-muted mb-4">Select an element to configure its properties</p>

                <div className="border border-dashed border-neutral-muted rounded-sm p-4 bg-neutral-light flex flex-col items-center justify-center">
                  <Settings className="h-8 w-8 text-neutral-muted mb-2" />
                  <p className="text-neutral-muted text-center text-sm">
                    No element selected. Click on an element in the form builder to edit its properties.
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-text">Templates</label>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1.5 bg-accent-success/10 text-accent-success text-xs rounded-full">Contact Form</div>
                      <div className="px-2 py-1.5 bg-accent-info/10 text-accent-info text-xs rounded-full">Survey</div>
                      <div className="px-2 py-1.5 bg-accent-purple/10 text-accent-purple text-xs rounded-full">Registration</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-text">Form Settings</label>
                    <div className="space-y-2">
                      <button className="flex items-center justify-between w-full p-2.5 bg-neutral-light hover:bg-neutral-dark rounded-md transition-colors text-sm">
                        <span>Form Validation</span>
                        <ArrowRight className="h-4 w-4 text-neutral-muted" />
                      </button>
                      <button className="flex items-center justify-between w-full p-2.5 bg-neutral-light hover:bg-neutral-dark rounded-md transition-colors text-sm">
                        <span>Submission Settings</span>
                        <ArrowRight className="h-4 w-4 text-neutral-muted" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </DndProvider>
      </div>

    </div>
  );
}