import { env } from '@/env.mjs'
import { Editor as TinyMCE } from '@tinymce/tinymce-react';


type Props = {
    onChange: (value: string) => void;
    value: string;
}

const TelegramMessageEditor = ({ onChange, value }: Props) => {
    return (
        <TinyMCE
            value={value}
            onEditorChange={onChange}
            apiKey={env.NEXT_PUBLIC_TINY_MCE_SECRET}

            init={{
                height: 300,
                menubar: false,
                relative_urls: false,
                remove_script_host: false,
                convert_urls: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'wordcount'
                ],
                toolbar: 'undo redo | ' +
                    'bold italic strikethrough | link',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}

        />
    )
}

export default TelegramMessageEditor