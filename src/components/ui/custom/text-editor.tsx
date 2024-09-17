import { type LegacyRef, forwardRef, useRef } from 'react';
import { Editor as TinyMCE } from '@tinymce/tinymce-react';
import { env } from '@/env.mjs';
import { type Editor as EditorType, type IAllProps } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';

type RefType = LegacyRef<EditorType>
type Props = IAllProps & {
    error?: string;
    height?: number;
    onChange?: (value: string) => void;
}
const TextEditor = forwardRef<RefType, Props>(({ onChange, value, height = 500, ...props }, outerRef) => {
    const editorRef = useRef<any>(null);

    return (
        <TinyMCE
            {...props}
            onEditorChange={(newValue) => onChange?.(newValue)}
            apiKey={env.NEXT_PUBLIC_TINY_MCE_SECRET}
            onInit={(evt, editor) => {
                if (!outerRef) return;
                
                editorRef.current = editor;
            }}
            ref={outerRef as RefType}
            value={value}
            
            init={{
                height: height,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
})

TextEditor.displayName = 'Text Editor';

export default TextEditor;