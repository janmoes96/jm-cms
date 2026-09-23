interface TextBlockProps {
    block: {
        content?: string;
    };
    onChange: (updatedContent: string) => void;
}

export default function TextBlockComponent({ block, onChange }: TextBlockProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tekst Inhoud</label>
            <textarea
                rows={4}
                value={block.content || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Typ hier je inhoud..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>
    );
}