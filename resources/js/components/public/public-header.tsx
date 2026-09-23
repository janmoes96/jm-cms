import { Link, usePage } from '@inertiajs/react';

interface PageItem {
    id: number;
    title: string;
    slug: string;
}

export default function PublicHeader() {
    const { props } = usePage();
    const pages = (props.pages as PageItem[]) || [];

    return (
        <header className="border-b border-green-800 bg-zinc-950 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
                <Link href="/" className="font-bold text-lg text-green-400 tracking-wider hover:text-green-300">
                    C:\&gt; MIJN_WEBSITE_
                </Link>
                
                <nav className="flex flex-wrap items-center gap-4 text-sm text-green-600">
                    {/* <Link href="/" className="hover:text-green-400 transition-colors">[ HOME ]</Link> */}
                    
                    {/* Dynamische weergave van alle CMS pagina's */}
                    {pages.map((page) => (
                        <Link 
                            key={page.id} 
                            href={`/${page.slug}`} 
                            className="hover:text-green-400 transition-colors uppercase"
                        >
                            [ {page.title} ]
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}