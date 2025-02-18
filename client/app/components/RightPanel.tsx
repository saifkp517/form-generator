import { Settings, ArrowRight } from 'lucide-react';

export default function RightPanel({ selectedElement, setFormElements, selectedIndex }: any) {

    if (!selectedElement) {
        return (
            <div className="p-4 text-neutral-muted">
                <Settings className="h-8 w-8 mb-2" />
                <p>Select an element to customize its properties.</p>
            </div>
        );
    }

    const updateElementProperty = (property: any, value: any) => {
        setFormElements((prevElements: any) =>
            prevElements.map((el: any, i: any) => (i === selectedIndex ? { ...el, [property]: value } : el))
        );
    };

    // Helper function to render common properties for all elements
    const renderCommonProperties = () => (
        <>
            {/* Label */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Label</label>
                <input
                    type="text"
                    value={selectedElement.label || ""}
                    onChange={(e) => updateElementProperty("label", e.target.value)}
                    className="border p-2 text-neutral-muted w-full rounded mt-1"
                    placeholder="Element label"
                    onFocus={e => e.target.select()}
                />
            </div>

            {/* Required Checkbox */}
            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    id="required-checkbox"
                    checked={selectedElement.required || false}
                    onChange={(e) => updateElementProperty("required", e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="required-checkbox" className="text-sm font-medium text-neutral-text">
                    Required field
                </label>
            </div>
            
            {/* Help Text */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Help Text</label>
                <input
                    type="text"
                    value={selectedElement.helpText || ""}
                    onChange={(e) => updateElementProperty("helpText", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Additional information for users"
                />
            </div>
        </>
    );

    // Render text input specific properties
    const renderTextInputProperties = () => (
        <>
            {/* Placeholder */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Placeholder</label>
                <input
                    type="text"
                    value={selectedElement.placeholder || ""}
                    onChange={(e) => updateElementProperty("placeholder", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Enter placeholder text"
                />
            </div>
            
            {/* Min Length */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Minimum Length</label>
                <input
                    type="number"
                    value={selectedElement.minLength || ""}
                    onChange={(e) => updateElementProperty("minLength", parseInt(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="0"
                    min="0"
                />
            </div>
            
            {/* Max Length */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Maximum Length</label>
                <input
                    type="number"
                    value={selectedElement.maxLength || ""}
                    onChange={(e) => updateElementProperty("maxLength", parseInt(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="255"
                    min="1"
                />
            </div>
            
            {/* Pattern/Regex Validation */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Validation Pattern (Regex)</label>
                <input
                    type="text"
                    value={selectedElement.pattern || ""}
                    onChange={(e) => updateElementProperty("pattern", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="e.g., [A-Za-z]+ for letters only"
                />
            </div>
            
            {/* Validation Error Message */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Validation Error Message</label>
                <input
                    type="text"
                    value={selectedElement.errorMessage || ""}
                    onChange={(e) => updateElementProperty("errorMessage", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Custom error message"
                />
            </div>
        </>
    );

    // Render number input specific properties
    const renderNumberInputProperties = () => (
        <>
            {/* Placeholder */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Placeholder</label>
                <input
                    type="text"
                    value={selectedElement.placeholder || ""}
                    onChange={(e) => updateElementProperty("placeholder", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Enter placeholder text"
                />
            </div>
            
            {/* Min Value */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Minimum Value</label>
                <input
                    type="number"
                    value={selectedElement.min || ""}
                    onChange={(e) => updateElementProperty("min", parseFloat(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="No minimum"
                />
            </div>
            
            {/* Max Value */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Maximum Value</label>
                <input
                    type="number"
                    value={selectedElement.max || ""}
                    onChange={(e) => updateElementProperty("max", parseFloat(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="No maximum"
                />
            </div>
            
            {/* Step */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Step</label>
                <input
                    type="number"
                    value={selectedElement.step || ""}
                    onChange={(e) => updateElementProperty("step", parseFloat(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="1"
                    min="0.001"
                    step="0.001"
                />
            </div>
        </>
    );

    // Render email input specific properties
    const renderEmailInputProperties = () => (
        <>
            {/* Placeholder */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Placeholder</label>
                <input
                    type="text"
                    value={selectedElement.placeholder || ""}
                    onChange={(e) => updateElementProperty("placeholder", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Enter placeholder text"
                />
            </div>
            
            {/* Custom validation for specific domains */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Allowed Domains (comma separated)</label>
                <input
                    type="text"
                    value={selectedElement.allowedDomains || ""}
                    onChange={(e) => updateElementProperty("allowedDomains", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="e.g., gmail.com, outlook.com"
                />
            </div>
        </>
    );

    // Render dropdown specific properties
    const renderDropdownProperties = () => (
        <>
            {/* Options */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Options</label>
                <textarea
                    value={selectedElement.options?.join("\n") || ""}
                    onChange={(e) => updateElementProperty("options", e.target.value.split("\n").filter(Boolean))}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Enter options, one per line"
                    rows={5}
                />
            </div>
            
            {/* Multiple selection */}
            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    id="multiple-checkbox"
                    checked={selectedElement.multiple || false}
                    onChange={(e) => updateElementProperty("multiple", e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="multiple-checkbox" className="text-sm font-medium text-neutral-text">
                    Allow multiple selections
                </label>
            </div>
        </>
    );

    // Render checkbox specific properties
    const renderCheckboxProperties = () => (
        <>
            {/* Default checked state */}
            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    id="default-checked"
                    checked={selectedElement.defaultChecked || false}
                    onChange={(e) => updateElementProperty("defaultChecked", e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="default-checked" className="text-sm font-medium text-neutral-text">
                    Checked by default
                </label>
            </div>
        </>
    );

    // Render radio button specific properties
    const renderRadioProperties = () => (
        <>
            {/* Options */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Options</label>
                <textarea
                    value={selectedElement.options?.join("\n") || ""}
                    onChange={(e) => updateElementProperty("options", e.target.value.split("\n").filter(Boolean))}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Enter options, one per line"
                    rows={5}
                />
            </div>
            
            {/* Default selected option */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Default Selected Option</label>
                <select
                    value={selectedElement.defaultValue || ""}
                    onChange={(e) => updateElementProperty("defaultValue", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                >
                    <option value="">None</option>
                    {selectedElement.options?.map((option: string, index: number) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
    
    // Render date input specific properties
    const renderDateInputProperties = () => (
        <>
            {/* Min date */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Minimum Date</label>
                <input
                    type="date"
                    value={selectedElement.min || ""}
                    onChange={(e) => updateElementProperty("min", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                />
            </div>
            
            {/* Max date */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Maximum Date</label>
                <input
                    type="date"
                    value={selectedElement.max || ""}
                    onChange={(e) => updateElementProperty("max", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                />
            </div>
        </>
    );
    
    // Render file input specific properties
    const renderFileInputProperties = () => (
        <>
            {/* Accepted file types */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Accepted File Types</label>
                <input
                    type="text"
                    value={selectedElement.accept || ""}
                    onChange={(e) => updateElementProperty("accept", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="e.g., .pdf,.jpg,.png"
                />
            </div>
            
            {/* Multiple files */}
            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    id="multiple-files"
                    checked={selectedElement.multiple || false}
                    onChange={(e) => updateElementProperty("multiple", e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="multiple-files" className="text-sm font-medium text-neutral-text">
                    Allow multiple files
                </label>
            </div>
            
            {/* Max file size */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Maximum File Size (MB)</label>
                <input
                    type="number"
                    value={selectedElement.maxSize || ""}
                    onChange={(e) => updateElementProperty("maxSize", parseFloat(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="5"
                    min="0.1"
                    step="0.1"
                />
            </div>
        </>
    );

    // Render textArea specific properties
    const renderTextAreaProperties = () => (
        <>
            {/* Placeholder */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Placeholder</label>
                <input
                    type="text"
                    value={selectedElement.placeholder || ""}
                    onChange={(e) => updateElementProperty("placeholder", e.target.value)}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="Enter placeholder text"
                />
            </div>
            
            {/* Rows */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Rows</label>
                <input
                    type="number"
                    value={selectedElement.rows || ""}
                    onChange={(e) => updateElementProperty("rows", parseInt(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="4"
                    min="1"
                />
            </div>
            
            {/* Min Length */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Minimum Length</label>
                <input
                    type="number"
                    value={selectedElement.minLength || ""}
                    onChange={(e) => updateElementProperty("minLength", parseInt(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="0"
                    min="0"
                />
            </div>
            
            {/* Max Length */}
            <div className="mb-4">
                <label className="text-sm font-medium text-neutral-text">Maximum Length</label>
                <input
                    type="number"
                    value={selectedElement.maxLength || ""}
                    onChange={(e) => updateElementProperty("maxLength", parseInt(e.target.value) || "")}
                    className="border p-2 w-full rounded mt-1"
                    placeholder="1000"
                    min="1"
                />
            </div>
        </>
    );

    return (
        <div className="border-l border-neutral-dark w-80 h-full overflow-y-auto">
            {/* Header */}
            <div className="p-3 bg-primary text-white sticky top-0">
                <h3 className="font-medium">Element Properties</h3>
            </div>

            <div className="p-4">
                {/* No Element Selected */}
                {!selectedElement ? (
                    <div className="border border-dashed border-neutral-muted rounded-sm p-4 bg-neutral-light flex flex-col items-center justify-center">
                        <Settings className="h-8 w-8 text-neutral-muted mb-2" />
                        <p className="text-neutral-muted text-center text-sm">
                            No element selected. Click on an element in the form builder to edit its properties.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Selected Element Customization */}
                        <div className="mb-4 pb-3 border-b border-neutral-light">
                            <h3 className="font-medium text-accent-info text-lg">Edit {selectedElement.type} Element</h3>
                            <p className="text-sm text-neutral-muted mt-1">Customize the selected form element.</p>
                        </div>

                        {/* Common Properties for All Element Types */}
                        {renderCommonProperties()}

                        {/* Element-specific Properties */}
                        <div className="mt-6 mb-4 pb-2 border-b border-neutral-light">
                            <h4 className="font-medium text-sm uppercase text-neutral-muted tracking-wide">
                                {selectedElement.type}-specific Settings
                            </h4>
                        </div>

                        {selectedElement.type === "text" && renderTextInputProperties()}
                        {selectedElement.type === "number" && renderNumberInputProperties()}
                        {selectedElement.type === "email" && renderEmailInputProperties()}
                        {selectedElement.type === "dropdown" && renderDropdownProperties()}
                        {selectedElement.type === "checkbox" && renderCheckboxProperties()}
                        {selectedElement.type === "radio" && renderRadioProperties()}
                        {selectedElement.type === "date" && renderDateInputProperties()}
                        {selectedElement.type === "file" && renderFileInputProperties()}
                        {selectedElement.type === "textarea" && renderTextAreaProperties()}
                    </>
                )}

                {/* Templates */}
                {/* <div className="mt-6 space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-text">Templates</label>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-2 py-1.5 bg-accent-success/10 text-accent-success text-xs rounded-full">
                                Contact Form
                            </div>
                            <div className="px-2 py-1.5 bg-accent-info/10 text-accent-info text-xs rounded-full">
                                Survey
                            </div>
                            <div className="px-2 py-1.5 bg-accent-purple/10 text-accent-purple text-xs rounded-full">
                                Registration
                            </div>
                        </div>
                    </div>

                    Form Settings
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
                </div> */}
            </div>
        </div>
    );
}