import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Strikethrough, Heading1, Heading2, List } from 'lucide-react'
import { Button } from './ui/button'

const Editor = ({ content, onUpdate }: { content: string, onUpdate: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    editable: true,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="editor-container w-full border border-neutral-900 rounded-lg bg-neutral-950 mt-1">
      <div className="editor-toolbar flex flex-wrap gap-2 px-2 py-1 border-b border-neutral-900 bg-neutral-900 rounded-t-lg">
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
