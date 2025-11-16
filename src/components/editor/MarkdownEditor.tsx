import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Code, FileText } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter markdown...',
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

  return (
    <div className={`markdown-editor ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-t-lg">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
              viewMode === 'edit'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Code className="w-4 h-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
              viewMode === 'preview'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
              viewMode === 'split'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            Split
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Markdown supported
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="flex border border-gray-300 dark:border-gray-600 border-t-0 rounded-b-lg overflow-hidden">
        {/* Editor */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2 border-r border-gray-300 dark:border-gray-600' : 'w-full'}`}>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-64 p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ minHeight: '200px' }}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-y-auto`}>
            <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white prose prose-sm dark:prose-invert max-w-none">
              {value ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">{placeholder}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

