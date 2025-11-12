import React, { memo } from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup = memo(({ label, name, type = 'text', value, onChange }: InputGroupProps) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            required
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-orange-600 focus:border-orange-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 shadow-inner"
        />
    </div>
));

export { InputGroup };