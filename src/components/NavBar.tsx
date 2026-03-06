"use client"
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useCartStore } from '@/src/store/cartStore';
import CartModal from '@/src/components/CartModal';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { toggleCart, getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="w-full sticky top-0 z-50 px-6 py-3 bg-color-primary">
            <div className="flex items-center justify-between">
                <Link href={`/`}>
                    <Image
                        src="/logo.png"
                        alt="Andrea Franceschini La Falda - Logo de pastelería artesanal"
                        width={100}
                        height={20}
                        priority className="w-14" />
                </Link>

                <nav className="gap-12 text-white font-secondary cursor-pointer hidden md:flex">
                    <Link href="/#home" className="text-white border-b border-transparent hover:underline underline-offset-6 transition-all duration-300 hover:opacity-80">Inicio</Link>
                    <Link href="/#history" className="text-white border-b border-transparent hover:underline underline-offset-6 transition-all duration-300 hover:opacity-80">Historia</Link>
                    <Link href="/#products" className="text-white border-b border-transparent hover:underline underline-offset-6 transition-all duration-300 hover:opacity-80">Productos</Link>
                    <Link href="/#contact" className="text-white border-b border-transparent hover:underline underline-offset-6 transition-all duration-300 hover:opacity-80">Contacto</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="relative flex gap-4 text-white cursor-pointer hover:text-background hover:scale-110 transition-all duration-300"
                        aria-label="Abrir carrito"
                    >

                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" /></svg>
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={toggleMenu}
                        className="text-white hover:text-color-primary focus:outline-none md:hidden"
                    >
                        {isOpen ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>
                </div>
            </div>
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} mt-6`}>
                <a href="#home" className="block py-2 text-white hover:bg-gray-700 rounded transition duration-300">Inicio</a>
                <a href="#history" className="block py-2 text-white hover:bg-gray-700 rounded transition duration-300">Historia</a>
                <a href="#products" className="block py-2 text-white hover:bg-gray-700 rounded transition duration-300">Productos</a>
                <a href="#contact" className="block py-2 text-white hover:bg-gray-700 rounded transition duration-300">Contacto</a>
            </div>
            <CartModal />
        </header>
    );
}

export default Header;
