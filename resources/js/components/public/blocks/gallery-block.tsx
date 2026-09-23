import ImageModal from '@/components/public/image-modal'; 

interface GalleryImage {
    id: number;
    image_path: string;
}

interface GalleryBlockProps {
    blockable: {
        title?: string;
        images?: GalleryImage[];
    };
}

export default function GalleryBlock({ blockable }: GalleryBlockProps) {
    return (
        <div className="p-6 bg-zinc-900 border border-green-900/50 rounded space-y-4">
            {blockable.title && (
                <h2 className="text-xl font-bold text-green-400">
                    &gt; {blockable.title} [GALERIJ]
                </h2>
            )}
            {blockable.images && blockable.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {blockable.images.map((img) => (
                        <ImageModal 
                            key={img.id}
                            src={`/storage/${img.image_path}`}
                            alt={blockable.title || 'Galerij afbeelding'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}