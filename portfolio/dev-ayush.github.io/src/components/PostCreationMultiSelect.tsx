import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';


const PostCreationMultiSelect: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState({
        Blog: false,
        LinkedIn: false
    });

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option: 'Blog' | 'LinkedIn') => {
        setSelected(prev => ({ ...prev, [option]: !prev[option] }));
    };

    const getButtonText = () => {
        const selectedOptions = Object.entries(selected)
            .filter(([_, isSelected]) => isSelected)
            .map(([name, _]) => name);

        if (selectedOptions.length === 0) return 'Select platforms';
        if (selectedOptions.length === 2) return 'Blog and LinkedIn';
        return selectedOptions[0];
    };


    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    onClick={toggleDropdown}
                >
                    Create post for: {getButtonText()}
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {Object.entries(selected).map(([option, isSelected]) => (
                            <div key={option} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                <input
                                    type="checkbox"
                                    id={option}
                                    checked={isSelected}
                                    onChange={() => handleSelect(option as 'Blog' | 'LinkedIn')}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={option} className="ml-2 block text-sm text-gray-900">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export default PostCreationMultiSelect;