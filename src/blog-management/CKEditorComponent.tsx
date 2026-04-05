import React, { useRef, useEffect, useState } from 'react';
import type Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
import type EventInfo from '@ckeditor/ckeditor5-utils/src/eventinfo';
import { uploadImage } from '../utils/api'; // Import your existing upload function

interface CKEditorComponentProps {
  config: Record<string, unknown>;
  data?: string;
  onChange: (event: EventInfo<string, unknown>, editor: Editor) => void;
  onReady?: (editor: Editor) => void;
}

// Custom upload adapter that uses your API function
class CustomUploadAdapter {
  private loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    try {
      const imageUrl = await uploadImage(file);
      return { default: imageUrl };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  abort() {
    // Optional abort logic
  }
}

// Plugin that registers the custom adapter
function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader);
  };
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  config,
  data,
  onChange,
  onReady
}) => {
  const editorRef = useRef<Editor | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [CKEditor, setCKEditor] = useState<React.ComponentType<any> | null>(null);
  const [ClassicEditor, setClassicEditor] = useState<unknown>(null);

  useEffect(() => {
    // Dynamically import CKEditor to avoid duplication
    Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('@ckeditor/ckeditor5-build-classic')
    ]).then(([{ CKEditor: CK }, CE]) => {
      setCKEditor(() => CK);
      setClassicEditor(() => CE.default);
    });

    return () => {
      // Cleanup editor instance on unmount
      if (editorRef.current) {
        editorRef.current.destroy().catch(() => {
          // Ignore cleanup errors
        });
      }
    };
  }, []);

  if (!CKEditor || !ClassicEditor) {
    return <div className="min-h-[200px] bg-white/5 border border-white/20 rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading editor...</div>
    </div>;
  }

  // Deep clone the config to avoid mutations and ensure each instance has its own copy
  const modifiedConfig = JSON.parse(JSON.stringify(config));

  // Add custom upload adapter plugin to the config
  if (!modifiedConfig.extraPlugins) {
    modifiedConfig.extraPlugins = [];
  }
  modifiedConfig.extraPlugins.push(CustomUploadAdapterPlugin);

  // Enable image upload toolbar button if not already present
  // (We'll handle toolbar items in BlogForm config)

  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onReady={(editor: Editor) => {
        editorRef.current = editor;
        if (onReady) {
          onReady(editor);
        }
      }}
      onChange={onChange}
      config={modifiedConfig}
    />
  );
};

export default CKEditorComponent;