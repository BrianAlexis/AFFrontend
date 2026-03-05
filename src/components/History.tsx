const History = () => {
    return (
        <section id="history" className="bg-background">
            <div
                className="h-[900px] md:h-[750px] place-content-center
          relative p-4 
          bg-background-secondary text-white overflow-hidden
          
          before:content-[''] 
          before:absolute 
          before:top-0 
          before:left-0 
          before:w-full 
          before:h-25
          before:bg-background
          before:[clip-path:polygon(0_0,120%_0,0%_100%)]
          
          after:content-[''] 
          after:absolute 
          after:bottom-0 
          after:right-0 
          after:w-full 
          after:h-25
          after:bg-background
          after:[clip-path:polygon(100%_0,100%_120%,0_100%)]
        ">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
                    <h2 className="text-color-tertiary text-5xl lg:text-6xl font-primary font-bold pb-8">Nuestra Historia</h2>
                    <p className="text-color-tertiary text-xl md:text-2xl opacity-90">En <span className="font-bold text-color-primary">Andrea&nbsp;Franceschini</span> creemos que cada momento especial merece una celebración única. Con años de experiencia en pastelería artesanal, nos dedicamos a crear delicias que no solo deleitan el paladar, sino que también crean recuerdos inolvidables.
                        Utilizamos ingredientes de primera calidad y técnicas tradicionales para garantizar que cada producto que sale de nuestro horno sea excepcional.</p>

                </div>
            </div>
        </section>
    );
};

export default History;