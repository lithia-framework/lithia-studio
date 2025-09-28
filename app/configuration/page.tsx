'use client';

import { LithiaContext } from '@/components/contexts/LithiaContext';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { useContext } from 'react';

export default function ConfigurationPage() {
  const { app } = useContext(LithiaContext);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              Configuration
            </h1>
            <p className="text-gray-400">View current Lithia configuration</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-108.79px)]">
        <CodeEditor
          value={JSON.stringify(app.config, null, 2)}
          onChange={() => {}}
          language="json"
          readOnly={true}
          className="h-full"
          height="100%"
          showMinimap={false}
          showLineNumbers={true}
          wordWrap="on"
          contextMenu={false}
          glyphMargin={false}
          folding={true}
          stickyScroll={false}
        />
      </div>
    </div>
  );
}
