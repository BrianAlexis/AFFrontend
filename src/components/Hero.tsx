import ConfettiBackground from "./ConfettiBackground";

const Hero = () => {
    return (
        <main id="home">
            <div className="w-full h-[calc(98vh-6rem)] content-center flex items-center">
                <ConfettiBackground />
                <div className="flex flex-col mx-auto text-center items-center z-10">
                    <h1 className="text-color-primary text-5xl md:text-7xl font-primary font-bold animate-fade-in-up">
                        Andrea Franceschini <br />La Falda
                    </h1>
                    <p className="text-color-secondary text-xl md:text-2xl py-4 px-13 animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
                        Pastelería artesanal de&nbsp;alta&nbsp;calidad. <br />Cada creación hecha con amor y&nbsp;dedicación.
                    </p>
                    <div className="flex gap-3 pt-4 animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <a href="#products" className="bg-color-primary text-white py-3 px-5 rounded-lg cursor-pointer hover:bg-color-primary-hover hover:scale-105 transition-all duration-300">
                            Ver productos
                        </a>
                        <a href="#contact" className="bg-color-secondary text-white py-3 px-5 rounded-lg cursor-pointer hover:bg-color-secondary-hover hover:scale-105 transition-all duration-300">
                            Contactanos
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Hero;
