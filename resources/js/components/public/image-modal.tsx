import { useState } from 'react';

interface ImageModalProps {
    src: string;
    alt?: string;
}

export default function ImageModal({ src, alt }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* De kleine afbeelding in de galerij die klikbaar is */}
            <div 
                onClick={() => setIsOpen(true)}
                className="overflow-hidden rounded border border-green-800 bg-black cursor-pointer group relative"
            >
                <img 
                    src={src} 
                    alt={alt || ''} 
                    className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-green-500 text-[10px] px-1 border border-green-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    [ZOOM]
                </div>
            </div>

            {/* De fullscreen DOS-modal als je op de afbeelding klikt */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div 
                        className="relative max-w-4xl w-full bg-zinc-950 border border-green-800 p-4 rounded shadow-[0_0_25px_rgba(0,255,0,0.15)]"
                        onClick={(e) => e.stopPropagation()} // Zorg dat klikken op de box de modal niet sluit
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-green-900 pb-2 mb-4 text-xs text-green-400">
                            <span>C:\VIEWER\IMAGE_PREVIEW.EXE</span>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-green-500 hover:text-black hover:bg-green-500 px-2 py-0.5 border border-green-800 transition-colors"
                            >
                                [X SLUITEN]
                            </button>
                        </div>

                        {/* Grote afbeelding */}
                        <div className="flex justify-center bg-black border border-green-950 p-2">
                            <img 
                                src={src} 
                                alt={alt || ''} 
                                className="max-h-[70vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}