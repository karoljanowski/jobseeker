import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Strikethrough, Heading1, Heading2, List } from 'lucide-react'
import { Button } from './ui/button'
import { useEffect, useRef } from 'react'

interface EditorProps {
  content: string
  onUpdate: (content: string) => void
  onCancel?: () => void
  onSave?: () => void
  disabled?: boolean
  placeholder?: string
}

const Editor = ({ content, onUpdate, onCancel, onSave, disabled, placeholder }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || ''}),
    ],
    content: content,
    editable: true,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
            if (onCancel) {
                onCancel()
            }
        }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col w-full editor" ref={editorRef}>
      <div className="editor-container w-full border border-gray-900 rounded-lg bg-gray-800 mt-1">
        <div className="editor-toolbar flex flex-wrap gap-2 px-2 py-1 bg-gray-700 rounded-t-lg">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
            <Bold className='w-4 h-4' />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
            <Italic className='w-4 h-4' />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
            <Strikethrough className='w-4 h-4' />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
            <Heading1 className='w-4 h-4' />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
            <Heading2 className='w-4 h-4' />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
            <List className='w-4 h-4' />
          </ToolbarButton>
        </div>
        <div className="editor-wrapper w-full">
          <EditorContent 
            editor={editor} 
            className='px-4 py-2'
          />
        </div>
      </div>
      {onCancel && onSave && (
        <div className="flex items-center gap-2 p-2">
          <Button variant="secondary" disabled={disabled} className='h-7' onClick={onSave}>Save</Button>
          <Button variant="ghost" disabled={disabled} className='h-7 hover:bg-red-500 hover:text-white' onClick={(e) => {e.stopPropagation(); onCancel()}}>Cancel</Button>
        </div>
      )}
    </div>
  )
}

export default Editor


const ToolbarButton = ({ children, onClick, isActive }: { children: React.ReactNode, onClick: () => void, isActive: boolean }) => {
  return (
    <Button onClick={onClick} variant={isActive ? 'secondary' : 'ghost'} className='h-8' size='icon'>
      {children}
    </Button>
  )
}
