import React, { useState } from 'react';
import { 
  Maximize,
  Minimize,
  Square,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  CreditCard,
  Package,
  Edit3,
  FileText
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';
import { Button } from '../../../ui/primitives/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/primitives/dialog';
import { ContentEditor } from '@/components/features/content/composer-modal/common/ContentEditor';

interface CanvasWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function CanvasWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: CanvasWidgetSettingsProps) {
  const [size, setSize] = useState('full');
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [content, setContent] = useState([]);

  const handleOpenEditor = () => {
    setEditorModalOpen(true);
  };

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
          <PropertyRow
            label="Size"
            value={size}
            fieldName="canvasSize"
            type="select"
            options={[
              { value: 'full', label: 'Full', icon: Maximize },
              { value: 'large', label: 'Large', icon: Square },
              { value: 'medium', label: 'Medium', icon: Square },
              { value: 'small', label: 'Small', icon: Minimize }
            ]}
            onValueChange={setSize}
            icon={Square}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Size of the canvas container"
          />

          {size !== 'full' && (
            <PropertyRow
              label="Alignment"
              value="center"
              fieldName="canvasAlignment"
              type="select"
              options={[
                { value: 'left', label: 'Left', icon: AlignLeft },
                { value: 'center', label: 'Center', icon: AlignCenter },
                { value: 'right', label: 'Right', icon: AlignRight }
              ]}
              onValueChange={() => {}}
              icon={AlignCenter}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="How the canvas should be positioned"
            />
          )}

          <PropertyRow
            label="Wrapper"
            value="none"
            fieldName="canvasWrapper"
            type="select"
            options={[
              { value: 'none', label: 'None', icon: Package },
              { value: 'card', label: 'Card', icon: CreditCard }
            ]}
            onValueChange={() => {}}
            icon={Package}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Wrapper style for the canvas"
          />

          <PropertyRow
            label="Content"
            value={content.length > 0 ? "Content added" : "Empty"}
            fieldName="canvasContent"
            type="text"
            onValueChange={() => {}}
            placeholder="Click to edit content"
            icon={Edit3}
            editingField={editingField}
            onFieldClick={() => handleOpenEditor()}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Rich content editor for the canvas"
          />
        </div>
      </div>

      {/* Content Editor Modal */}
      <Dialog open={editorModalOpen} onOpenChange={setEditorModalOpen}>
        <DialogContent className="max-w-4xl bg-white max-h-[80vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-4 py-4">
            <DialogTitle className="flex text-base items-center gap-2">
              <FileText className="w-5 h-5" />
              Canvas Content Editor
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden bg-white p-0">
            <ContentEditor
              content={content}
              onContentChange={handleContentChange}
            />
          </div>

          <div className="flex justify-end gap-2 px-4 py-4 border-t border-gray-200 bg-white">
            <Button 
              variant="outline" 
              onClick={() => setEditorModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setEditorModalOpen(false)}
            >
              Save Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 