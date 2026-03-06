'use client';

import { AnimatedSection } from './AnimatedSection';

const Footer = () => {

    const year = new Date().getFullYear()

    return (
        <div className="bg-text-secondary pt-8 pb-6">
            <div className="flex flex-col items-center text-center text-background">
                <AnimatedSection animation="fade-in-up">
                    <h3 className="font-primary text-2xl">Andrea Franceschini</h3>
                    <p className="font-secondary mt-2 mb-4 opacity-100">Pastelería artesanal de alta calidad</p>
                    <p className="font-secondary text-xs opacity-100">© {year} Andrea Franceschini. Todos los derechos reservados.</p>
                </AnimatedSection>
            </div>
        </div>
    )
}
export default Footer
