import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getStrapiData } from '@/src/components/lib/strapi';
import type { Producto } from '@/src/types/strapi';

const systemPrompt = `Eres un asistente virtual de una pastelería. Ayudas a los clientes con información sobre productos, precios y pedidos.

IMPORTANTE: El cliente ya está en la página web cuando te escribe. Siempre refiérete a "esta página", "la página", "aquí en la página" o "en esta misma página", nunca digas "visita nuestra página web" o "en nuestra página web" porque el usuario ya está aquí.

Instrucciones:

- Sé amable y profesional

- Tu objetivo principal es guiar a los clientes para que compren directamente aquí en esta página

- Recomienda productos según las preferencias del cliente y guíalos para que los busquen en esta misma página

- Informa sobre precios y características de los productos

- Si un cliente pregunta sobre un producto, guíalo para que:
  1. Busque el producto en la sección de productos de esta página
  2. Haga clic en el producto para ver más detalles
  3. Agregue el producto al carrito
  4. Finalice la compra en el checkout

- Sugiere productos complementarios cuando sea apropiado

- Responde en español de forma natural y cercana

- Cuando menciones precios, productos, cantidad de personas u otros datos importantes, usa **negritas** para destacarlos

- NO menciones información sobre stock o disponibilidad de productos

- NO menciones WhatsApp, teléfono u otros medios de contacto al principio de la conversación

- SOLO sugiere contactar por WhatsApp o teléfono si el cliente ha hecho muchas preguntas (más de 5-6 mensajes) y no se está llegando a un acuerdo, o si el cliente específicamente pregunta por formas de contacto alternativas

- Prioriza siempre guiar al cliente hacia la compra aquí en esta página`;

// Función para obtener todos los productos de Strapi
async function getAllProducts(): Promise<Producto[]> {
    try {
        const productsQuery = "/api/products?fields[0]=titulo&fields[1]=descripcion&fields[2]=cantidadpersonas&fields[3]=slug&fields[4]=precioSolo&populate[categorias][fields][0]=nombre&populate[categorias][fields][1]=slug&populate[Precio][fields][0]=precio&populate[Precio][fields][1]=cantidadPersonasMin&populate[Precio][fields][2]=cantidadPersonasMax&populate[Precio][populate][tamano][fields][0]=nombre";
        const products = await getStrapiData(productsQuery);
        return (products as Producto[]) || [];
    } catch (error) {
        console.error('Error obteniendo productos', error);
        return [];
    }
}

// Función para obtener información del negocio
function getBusinessInfo(): string {
    return `INFORMACIÓN DEL NEGOCIO:

**Nombre:** Andrea Franceschini La Falda
**Ubicación:** La Falda, Córdoba
**Link de Google Maps:** https://www.google.com/maps/search/?api=1&query=Andrea+Franceschini+La+Falda,+La+Falda,+Córdoba
**Teléfono:** +54 9 351 - 2186616
**WhatsApp:** +54 9 351 - 2186616
**Instagram:** @andrea_franceschini_lafalda
**Horarios:** Lunes a domingos: 9:30 - 13:30 y 17:00 a 21:00
**Descripción:** Pastelería artesanal de alta calidad. Cada creación hecha con amor y dedicación.

IMPORTANTE: Cuando un cliente pregunte sobre la ubicación, dónde estamos ubicados, dónde queda el negocio, o cualquier pregunta relacionada con la ubicación, SIEMPRE debes incluir al final el link de Google Maps: https://www.google.com/maps/search/?api=1&query=Andrea+Franceschini+La+Falda,+La+Falda,+Córdoba para que puedan ver la ubicación exacta.`;
}

// Función para formatear los productos en un contexto legible para el chatbot
function formatProductsContext(products: Producto[]): string {
    if (products.length === 0) {
        return 'No hay productos disponibles en este momento.';
    }

    let context = 'PRODUCTOS DISPONIBLES:\n\n';

    products.forEach((product) => {
        context += `- **${product.titulo}**\n`;
        context += `  Descripción: ${product.descripcion || 'Sin descripción'}\n`;
        if (product.cantidadpersonas) {
            context += `  Cantidad de personas: **${product.cantidadpersonas}**\n`;
        }

        if (product.precioSolo) {
            context += `  Precio: **$${product.precioSolo}**\n`;
        }

        if (product.Precio && product.Precio.length > 0) {
            context += `  Precios por tamaño:\n`;
            product.Precio.forEach((precio) => {
                const tamano = precio.tamano?.nombre || 'Tamaño estándar';
                context += `    - **${tamano}**: **$${precio.precio}**`;
                if (precio.cantidadPersonasMin && precio.cantidadPersonasMax) {
                    context += ` (**${precio.cantidadPersonasMin}-${precio.cantidadPersonasMax} personas**)`;
                }
                context += '\n';
            });
        }

        if (product.categorias && product.categorias.length > 0) {
            const categorias = product.categorias.map(cat => cat.nombre).join(', ');
            context += `  Categorías: ${categorias}\n`;
        }

        context += `  Slug: ${product.slug}\n\n`;
    });

    return context;
}

export async function POST(request: NextRequest) {
    try {
        const { message, conversationHistory = [] } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'El mensaje es requerido' },
                { status: 400 }
            );
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            return NextResponse.json(
                { error: 'GROQ_API_KEY no está configurada' },
                { status: 500 }
            );
        }

        const products = await getAllProducts();
        const productsContext = formatProductsContext(products);
        const businessInfo = getBusinessInfo();

        const groq = new Groq({
            apiKey: groqApiKey,
        });

        const enhancedSystemPrompt = `${systemPrompt}\n\n${businessInfo}\n\n${productsContext}\n\nRECORDATORIO FINAL: 
- El cliente YA ESTÁ en la página web. Siempre di "aquí en esta página", "en esta misma página", "en la sección de productos de esta página", etc. NUNCA digas "visita nuestra página web" o "en nuestra página web".
- Usa la información de productos proporcionada arriba para responder a las preguntas de los clientes. Si un cliente pregunta sobre un producto específico, usa los datos exactos de la lista.
- Cuando menciones información del negocio (ubicación, teléfono, horarios, etc.), usa los datos exactos proporcionados arriba.
- SIEMPRE que un cliente pregunte sobre ubicación, dónde estamos, dónde queda el negocio, o cualquier pregunta relacionada con la ubicación, DEBES incluir al final el link de Google Maps: https://www.google.com/maps/search/?api=1&query=Andrea+Franceschini+La+Falda,+La+Falda,+Córdoba para que puedan hacer clic y ver la ubicación exacta.
- Siempre destaca en **negritas** los precios, nombres de productos, cantidad de personas y otros datos importantes cuando respondas.
- NO menciones información sobre stock o disponibilidad de productos.
- Tu prioridad es guiar a los clientes para que compren aquí en esta página. Guíalos paso a paso: buscar producto → ver detalles → agregar al carrito → finalizar compra.
- NO menciones WhatsApp o teléfono al principio. Solo sugiere contacto directo si el cliente ha hecho muchas preguntas sin llegar a un acuerdo o si específicamente pregunta por formas de contacto alternativas.`;

        const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: enhancedSystemPrompt,
            },
            ...conversationHistory.map((msg: { role: string; content: string }) => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
            })),
            {
                role: 'user',
                content: message,
            },
        ];

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
        });

        const assistantMessage = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

        return NextResponse.json({
            message: assistantMessage,
        });
    } catch (error) {
        console.error('Error en el chatbot:', error);
        return NextResponse.json(
            { error: 'Error al procesar la solicitud del chatbot' },
            { status: 500 }
        );
    }
}

