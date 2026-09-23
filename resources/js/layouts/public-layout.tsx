import { ReactNode } from 'react';
import PublicHeader from '@/components/public/public-header';
import PublicFooter from '@/components/public/public-footer';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col justify-between selection:bg-green-500 selection:text-black">
            <PublicHeader />

            <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12">
                <div className="border border-green-900/60 bg-zinc-950/50 p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,0,0.05)] rounded">
                    {children}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}