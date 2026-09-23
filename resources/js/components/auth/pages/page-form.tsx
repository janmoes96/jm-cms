import { useForm } from '@inertiajs/react';
import { FormEventHandler, ComponentType } from 'react';
import TextBlockComponent from './blocks/text-block';
import GalleryBlockComponent from './blocks/gallery-block';
import { route } from 'ziggy-js';

interface GalleryImage {
    id?: number;
    file?: File;
    image_path?: string;
    url?: string;
    preview?: string;
    sort_order?: number;
}

interface Block {
    id?: number;
    type?: string;
    blockable_type?: string;
    sort_order: number;
    content?: string;
    title?: string;
    images?: GalleryImage[];
}

interface PageFormProps {
    page?: {
        id: number;
        title: string;
        slug: string;
        is_published: boolean;
        blocks: Block[];
    };
    isEditing?: boolean;
}

// Koppel alle mogelijke sleutels aan de juiste componenten
const BLOCK_COMPONENTS: Record<string, ComponentType<{ block: any; onChange: (updated: any) => void }>> = {
    text: TextBlockComponent,
    'App\\Models\\Auth\\Blocks\\TextBlock': TextBlockComponent,
    gallery: GalleryBlockComponent,
    'App\\Models\\Auth\\Blocks\\GalleryBlock': GalleryBlockComponent,
};

export default function PageForm({ page, isEditing = false }: PageFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: page?.title || '',
        slug: page?.slug || '',
        is_published: page?.is_published ?? false,
        blocks: page?.blocks || [],
    });

    const addBlock = (type: 'text' | 'gallery') => {
        setData('blocks', [
            ...data.blocks,
            {
                type,
                blockable_type: type === 'text' ? 'App\\Models\\Auth\\Blocks\\TextBlock' : 'App\\Models\\Auth\\Blocks\\GalleryBlock',
                sort_order: data.blocks.length,
                content: type === 'text' ? '' : undefined,
                title: type === 'gallery' ? '' : undefined,
                images: type === 'gallery' ? [] : undefined,
            },
        ]);
    };

    const removeBlock = (index: number) => {
        const updatedBlocks = data.blocks.filter((_, i) => i !== index);
        setData(
            'blocks',
            updatedBlocks.map((block, i) => ({ ...block, sort_order: i }))
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('Formulier data die wordt verzonden:', data);
        // forceFormData is cruciaal om bestanden mee te sturen via PUT/PATCH of POST
        const options = {
            forceFormData: true,
        };

        if (isEditing) {
            put(route('admin.pages.update', page?.id), options);
        } else {
            post(route('admin.pages.store'), options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6 w-full">
            {/* Basis Pagina Velden */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800 space-y-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Algemene Informatie</h2>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titel</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Bijv. Over Ons"
                    />
                    {errors.title && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                    <input
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Bijv. over-ons"
                    />
                    {errors.slug && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div className="flex items-center pt-2">
                    <input
                        type="checkbox"
                        checked={data.is_published}
                        onChange={(e) => setData('is_published', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm focus:ring-indigo-500"
                    />
                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Gepubliceerd</label>
                </div>
            </div>

            {/* Dynamische Blokken Sectie */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pagina Blokken</h2>
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={() => addBlock('text')}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition font-medium"
                        >
                            + Tekst Blok
                        </button>
                        <button
                            type="button"
                            onClick={() => addBlock('gallery')}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition font-medium"
                        >
                            + Galerij Blok
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {data.blocks.map((block, index) => {
                        const blockKey = block.type || block.blockable_type || '';
                        const SpecificBlockComponent = BLOCK_COMPONENTS[blockKey];

                        return (
                            <div key={index} className="border border-gray-200 dark:border-zinc-800 p-4 rounded-md bg-gray-50 dark:bg-zinc-800/50 relative space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                                        Blok {index + 1}: {blockKey.includes('TextBlock') ? 'text' : blockKey.includes('GalleryBlock') ? 'gallery' : blockKey}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeBlock(index)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                                    >
                                        Verwijder
                                    </button>
                                </div>

                                {SpecificBlockComponent ? (
                                    <SpecificBlockComponent
                                        block={block}
                                        onChange={(updatedData) => {
                                            const newBlocks = [...data.blocks];
                                            newBlocks[index] = {
                                                ...newBlocks[index],
                                                ...(typeof updatedData === 'string' ? { content: updatedData } : updatedData),
                                            };
                                            setData('blocks', newBlocks);
                                        }}
                                    />
                                ) : (
                                    <p className="text-red-500 text-sm">Onbekend blok type ({blockKey})</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium transition"
                >
                    {isEditing ? 'Pagina Opslaan' : 'Pagina Aanmaken'}
                </button>
            </div>
        </form>
    );
}