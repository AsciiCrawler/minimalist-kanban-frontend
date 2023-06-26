/* Libraries */
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import { Button, Card, Divider } from '@mui/material'

/* Assets */
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null

    return (
        <div className='flex border-gray-200 border-b-[1px] border-l-0 border-r-0 border-t-0 border-solid'>
            <Button

                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().setParagraph().run()}
            >
                <span className={`font-bold ${editor.isActive('paragraph') ? "text-black" : "text-gray-600"}`}>n</span>
            </Button>
            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <span className={`font-bold ${editor.isActive('heading', { level: 1 }) ? "text-black" : "text-gray-600"}`}>h1</span>
            </Button>
            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <span className={`font-bold ${editor.isActive('heading', { level: 2 }) ? "text-black" : "text-gray-600"}`}>h2</span>
            </Button>
            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <span className={`font-bold ${editor.isActive('heading', { level: 3 }) ? "text-black" : "text-gray-600"}`}>h2</span>
            </Button>
            {/*  */}
            <Divider orientation='vertical' flexItem />
            {/*  */}
            <Button
                sx={{ minWidth: "0px" }}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                } onClick={() => editor.chain().focus().toggleBold().run()}>
                <FormatBoldRoundedIcon htmlColor={editor.isActive('bold') ? "black" : "gray"} />
            </Button>
            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
            >
                <FormatItalicRoundedIcon htmlColor={editor.isActive('italic') ? "black" : "gray"} />
            </Button>
            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run()
                }
            >
                <StrikethroughSRoundedIcon htmlColor={editor.isActive('strike') ? "black" : "gray"} />
            </Button>
            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleCode()
                        .run()
                }
            >
                <CodeRoundedIcon htmlColor={editor.isActive('code') ? "black" : "gray"} />
            </Button>

            {/*  */}
            <Divider orientation='vertical' flexItem />
            {/*  */}

            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <FormatListBulletedRoundedIcon htmlColor={editor.isActive('bulletList') ? "black" : "gray"} />
            </Button>
            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <FormatQuoteRoundedIcon htmlColor={editor.isActive('blockquote') ? "black" : "gray"} />
            </Button>

            {/*  */}
            <Divider orientation='vertical' flexItem />
            {/*  */}

            <Button
                sx={{ minWidth: "0px" }}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <HorizontalRuleRoundedIcon htmlColor={editor.isActive('blockquote') ? "black" : "gray"} />
            </Button>

            {/*  */}
            <Divider orientation='vertical' flexItem />
            {/*  */}
        </div>
    )
}

const getSize = (size: "small" | "medium" | "large") => {
    switch (size) {
        case "small": return "min-h-[75px] proseMirrorSmall";
        case "medium": return "min-h-[150px] proseMirrorMedium";
        case "large": return "min-h-[250px] proseMirrorLarge";
    }
}

const ComponentTiptap = ({ onUpdate, content, editable, contentId = "", size }: { onUpdate: (html: string) => void; content: string; contentId: string; editable: boolean; size: "small" | "medium" | "large" }) => {
    const editor = useEditor({
        extensions: [
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            TextStyle.configure(),
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
        ],
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML() ?? "");
        },
        content: content,
    })

    useEffect(() => {
        if (contentId == "") return;
        editor?.commands.setContent(content);
    }, [content, contentId]);

    useEffect(() => {
        if (typeof editable !== 'boolean') return;
        editor?.setEditable(editable);
    }, [editable]);

    return (
        <Card variant='outlined'>
            {editable == true && <MenuBar editor={editor} />}
            <EditorContent className={`px-2 ${getSize(size)}`} editor={editor} />
        </Card>
    )
}

export default ComponentTiptap;