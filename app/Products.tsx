import { getStrapiData } from "@/src/components/lib/strapi";
import ConfettiBackground from "../src/components/ConfettiBackground";
import ProductSection from '../src/components/ProductSection';
import { Categoria } from "@/types/strapi-types";
import { AnimatedSection } from "@/src/components/AnimatedSection";

export default async function Products() {
    const productsQuery = "/api/products?fields[0]=titulo&fields[1]=descripcion&fields[2]=cantidadpersonas&fields[3]=slug&fields[4]=precioSolo&fields[5]=stock&populate[imagen][fields][0]=url&populate[categorias][fields][0]=nombre&populate[categorias][fields][1]=slug&populate[Precio]=true";
    const productsArray = await getStrapiData(productsQuery) || [];
    const categoriasResponse = await getStrapiData("/api/categorias?fields[0]=nombre") || [];

    const strapiCategorias = categoriasResponse.map((category: Categoria) => category.nombre).filter(Boolean) || [];
    const categorias = ['Todos los productos', ...strapiCategorias];


    return (
        <div id="products" className="relative bg-background min-h-screen pt-20 pb-12 z-10">
            <ConfettiBackground />

            <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-8">
                <AnimatedSection animation="fade-in-up">
                    <h2 className="text-color-secondary text-5xl lg:text-6xl md:text-6xl font-primary font-bold pb-4 z-10">Nuestros productos</h2>
                </AnimatedSection>
                <AnimatedSection animation="fade-in-up" delay={0.15}>
                    <p className="text-color-secondary text-xl lg:text-2xl md:text-xl font-secondary opacity-80">Nuestras mejores creaciones, elegidas especialmente para&nbsp;vos. <br />Explora nuestra selección de delicias artesanales.</p>
                </AnimatedSection>
            </div>

            <ProductSection
                productsArray={productsArray}
                categorias={categorias}
            />

        </div>
    );
}
