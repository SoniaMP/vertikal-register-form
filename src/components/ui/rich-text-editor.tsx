"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
} from "lucide-react"

interface RichTextEditorProps {
  defaultValue?: string
  onChange?: (html: string) => void
  placeholder?: string
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  if (!editor) return null

  const items = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive("bold"), label: "Bold" },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive("italic"), label: "Italic" },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive("heading", { level: 2 }), label: "Heading 2" },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive("heading", { level: 3 }), label: "Heading 3" },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive("bulletList"), label: "Bullet list" },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive("orderedList"), label: "Ordered list" },
  ]

  return (
    <div className="flex gap-0.5 border-b border-input p-1">
      {items.map(({ icon: Icon, action, isActive, label }) => (
        <Button
          key={label}
          type="button"
          variant={isActive ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={action}
          aria-label={label}
        >
          <Icon />
        </Button>
      ))}
    </div>
  )
}

function RichTextEditor({
  defaultValue = "",
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none px-3 py-2 min-h-[120px] outline-none",
          "[&_p.is-editor-empty:first-child::before]:text-muted-foreground",
          "[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_p.is-editor-empty:first-child::before]:float-left",
          "[&_p.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_p.is-editor-empty:first-child::before]:h-0"
        ),
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor: e }) => onChange?.(e.getHTML()),
  })

  return (
    <div className="border-input rounded-md border bg-transparent shadow-xs">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export { RichTextEditor }
