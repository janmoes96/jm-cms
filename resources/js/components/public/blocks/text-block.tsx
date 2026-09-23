interface TextBlockProps {
    blockable: {
        title?: string;
        content?: string;
    };
}

export default function TextBlock({ blockable }: TextBlockProps) {
    return (
        <div className="p-6 bg-zinc-900 border border-green-900/50 rounded space-y-4">
            {blockable.title && (
                <h2 className="text-xl font-bold text-green-400">
                    &gt; {blockable.title}
                </h2>
            )}
            {blockable.content && (
                <div 
                    className="prose prose-invert max-w-none text-green-500 font-mono"
                    dangerouslySetInnerHTML={{ __html: blockable.content }} 
                />
            )}
        </div>
    );
}