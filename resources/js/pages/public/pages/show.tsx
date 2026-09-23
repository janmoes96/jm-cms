import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import TextBlock from '@/components/public/blocks/text-block';
import GalleryBlock from '@/components/public/blocks/gallery-block';
import { ReactNode, ComponentType } from 'react';

interface PageBlock {
    id: number;
    sort_order: number;
    blockable_type: string;
    blockable: any;
}

interface PageData {
    id: number;
    title: string;
    slug: string;
    blocks: PageBlock[];
}

interface Props {
    page: PageData;
}

const blockComponents: Record<string, ComponentType<{ blockable: any }>> = {
    'App\\Models\\Auth\\Blocks\\TextBlock': TextBlock,
    'text_block': TextBlock, // Of je morph map alias
    'App\\Models\\Auth\\Blocks\\GalleryBlock': GalleryBlock,
    'gallery_block': GalleryBlock,
};

export default function Show({ page }: Props) {
    return (
        <article className="space-y-10">
            <Head title={page.title} />

            <div className="border-b border-green-800 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-green-400">
                    C:\PAGES\{page.title.toUpperCase()}
                </h1>
            </div>

            <div className="space-y-6">
                {page.blocks && page.blocks.length > 0 ? (
                    page.blocks.map((block) => {
                        const Component = blockComponents[block.blockable_type];

                        if (!Component) {
                            return (
                                <div key={block.id} className="p-4 border border-red-900 text-red-500 font-mono text-xs">
                                    [ERROR: Onbekend bloktype: {block.blockable_type}]
                                </div>
                            );
                        }

                        return <Component key={block.id} blockable={block.blockable} />;
                    })
                ) : (
                    <p className="text-green-700 italic">[Geen data gevonden in deze sector]</p>
                )}
            </div>
        </article>
    );
}

Show.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;