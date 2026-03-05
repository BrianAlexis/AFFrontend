import ConfettiBackground from "@/src/components/ConfettiBackground";
import { getStrapiData } from "@/src/components/lib/strapi";
import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import ProductContent from "@/src/components/products/ProductContent";
import AdditionalProductsCarousel from "@/src/components/products/AdditionalProductsCarousel";
import StructuredData from "@/src/components/StructuredData";
import Link from "next/link";
import Image from "next/image";
import { STRAPI_HOST, NEXT_PUBLIC_BASE_URL } from "@/src/lib/constants";
import type { Producto, CategoriaConProductos } from "@/types/strapi-types";
import type { Metadata } from 'next';

type PageProps = {
    params: Promise<{ slug: string }>;
};

const siteUrl = NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const productQuery = `/api/products?filters[slug][$eq]=${slug}&fields[0]=titulo&fields[1]=descripcion&fields[2]=cantidadpersonas&fields[3]=slug&populate[imagen][fields][0]=url`;
    const productData = await getStrapiData(productQuery);
    const product: Producto = productData?.[0];

    if (!product) {
        return {
            title: 'Producto no encontrado',
        };
    }

    const title = `${product.titulo} | Andrea Franceschini La Falda`;
    const description = product.descripcion
        ? `${product.descripcion.substring(0, 150)}...`
        : `Descubre ${product.titulo} en Andrea Franceschini La Falda. Pastelería artesanal de alta calidad en La Falda, Córdoba.`;
    const imageUrl = product.imagen?.url
        ? `${STRAPI_HOST}${product.imagen.url}`
        : `${siteUrl}/logo.png`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${siteUrl}/productos/${slug}`,
            siteName: 'Andrea Franceschini La Falda',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.titulo,
                },
            ],
            locale: 'es_AR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${siteUrl}/productos/${slug}`,
        },
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const productQuery = `/api/products?filters[slug][$eq]=${slug}&fields[0]=titulo&fields[1]=descripcion&fields[2]=cantidadpersonas&fields[3]=slug&fields[4]=precioSolo&fields[5]=stock&fields[6]=documentId&populate[imagen][fields][0]=url&populate[categorias][fields][0]=nombre&populate[categorias][fields][1]=slug&populate[Precio][fields][0]=precio&populate[Precio][fields][1]=cantidadPersonasMin&populate[Precio][fields][2]=cantidadPersonasMax&populate[Precio][populate][tamano][fields][0]=nombre`;
    const productData = await getStrapiData(productQuery);
    const product: Producto = productData?.[0];

    const additionalQuery = "/api/categorias?filters[slug][$eq]=adicionales&populate[productos][populate][imagen][fields][0]=id&populate[productos][populate][imagen][fields][1]=url&populate[productos][fields][0]=id&populate[productos][fields][1]=documentId&populate[productos][fields][2]=titulo&populate[productos][fields][3]=descripcion&populate[productos][fields][4]=slug&populate[productos][fields][5]=precioSolo&populate[productos][fields][6]=cantidadpersonas&populate[productos][populate][Precio][fields][0]=precio";
    const additionalProductsData = await getStrapiData(additionalQuery);
    const additionalProducts: CategoriaConProductos[] = additionalProductsData;
    const categoriaNombre = additionalProducts?.[0]?.nombre;

    if (!product) return <div>Producto no encontrado</div>;

    const imageUrl = product.imagen?.url
        ? `${STRAPI_HOST}${product.imagen.url}`
        : null;
    const precio = product.precioSolo || (product.Precio && product.Precio.length > 0 ? product.Precio[0].precio : null);

    return (
        <>
            <StructuredData
                type="product"
                data={{
                    product: {
                        name: product.titulo,
                        description: product.descripcion || '',
                        image: imageUrl || undefined,
                        price: precio || undefined,
                        currency: 'ARS',
                    },
                }}
            />
            <StructuredData
                type="breadcrumb"
                data={{
                    breadcrumbs: [
                        { name: 'Home', url: '/#home' },
                        { name: 'Productos', url: '/#products' },
                        { name: product.titulo, url: `/productos/${product.slug}` },
                    ],
                }}
            />
            <NavBar />
            <main className="bg-background w-full h-full content-center z-10 mb-20">
                <ConfettiBackground />

                <div className="px-4 lg:max-w-7xl lg:mx-auto z-20 mt-4">
                    <div className="py-4 text-color-secondary opacity-80 font-secondary">
                        <Link href="/#home" className="text-color-secondary opacity-80 font-secondary">Home</Link> /&nbsp;
                        <Link href="/#products" className="text-color-secondary opacity-80 font-secondary">Productos</Link> /&nbsp;
                        <span className="text-color-primary font-bold capitalize">{product.titulo}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:gap-6 z-10">
                        {product?.imagen?.url && (
                            <Image
                                src={`${STRAPI_HOST}${product.imagen.url}`}
                                alt={product.titulo}
                                width={1200}
                                height={1200}
                                className="w-fit h-fit rounded-2xl lg:w-3/5 lg:h-3/5 z-10 object-contain"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority
                            />
                        )}

                        <ProductContent
                            titulo={product.titulo}
                            cantidadpersonas={product.cantidadpersonas}
                            precioSolo={product.precioSolo}
                            preciosVariables={product.Precio || []}
                            descripcion={product.descripcion}
                            productId={product.id}
                            productDocumentId={product.documentId}
                            productSlug={product.slug}
                            productImage={product.imagen?.url || null}
                        />
                    </div>
                </div>

                <div className="border-t border-amber-950/30 border-opacity-10 mt-15 mx-4 xl:max-w-7xl xl:mx-auto z-10 relative">
                    <div className="flex flex-col text-center mb-4 xl:text-left z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 lg:mb-10 text-color-secondary font-primary z-10 mt-8">
                            ¿Te tentaste con algo más?
                        </h2>
                        <p className="text-lg font-secondary text-color-secondary  opacity-90 z-10">
                            Productos sugeridos
                        </p>
                    </div>

                    <AdditionalProductsCarousel
                        productos={additionalProducts?.[0]?.productos || []}
                        categoriaNombre={categoriaNombre}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}