'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'sonner';

const Contact = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [errors, setErrors] = useState({ nombre: '', email: '', mensaje: '' });

    const validateForm = (): boolean => {
        const newErrors = { nombre: '', email: '', mensaje: '' };
        let isValid = true;

        if (!nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'El correo electrónico no es válido';
            isValid = false;
        }

        if (!mensaje.trim()) {
            newErrors.mensaje = 'El mensaje es obligatorio';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Error', {
                description: 'Por favor, completá todos los campos correctamente',
            });
            return;
        }

        const whatsappNumber = '5491159945412';
        const mensajeWhatsApp = `Hola! este es un mensaje que envié desde la web de Andrea Franceschini. \n\nMi nombre es *${nombre}*\n\n 📧 Email: ${email}\n\n💬 Mensaje:\n${mensaje}`;
        const encodedMessage = encodeURIComponent(mensajeWhatsApp);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        toast.success('¡Mensaje preparado!', {
            description: 'Se abrirá WhatsApp con tu mensaje',
        });

        setNombre('');
        setEmail('');
        setMensaje('');
        setErrors({ nombre: '', email: '', mensaje: '' });
    };

    return (
        <div id="contact" className="bg-background-secondary pt-20 pb-20">
            <div className="flex flex-col items-center text-center px-3 text-white">
                <h3 className="text-4xl md:text-6xl font-primary font-bold mb-4">¿Buscás algo más personalizado?</h3>
                <p className="text-xl lg:text-2xl md:text-xl font-secondary opacity-90">Estamos acá para hacer realidad tus <span className="text-color-primary font-bold">momentos&nbsp;especiales</span>.</p>
            </div>

            <div className="mt-10 md:mt-10 lg:mt-20 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] px-6 py-4 md:py-8 gap-14 md:gap-20 lg:gap-0 xl:gap-40">
                    <div className="grid md:grid-rows-2 md:grid-cols-2 lg:grid-cols-1 justify-items-center lg:justify-items-start text-center gap-8 h-fit">


                        <div className="flex flex-col lg:flex-row lg:text-left lg:gap-4 items-center">
                            <div className="shrink-0 w-12 h-12 bg-background-contact rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="text-color-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" /></svg>
                                </span>
                            </div>
                            <div className=" text-white">
                                <h3 className="text-lg font-semibold border-opacity-30 mb-1">
                                    Ubicación
                                </h3>
                                <p className="text-sm text-white opacity-70 lg:w-80">La Falda, Córdoba</p>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:text-left lg:gap-4 items-center">
                            <div className="shrink-0 w-12 h-12 bg-background-contact rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="text-color-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-outline icon-tabler-phone"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3a1 1 0 0 1 .877 .519l.051 .11l2 5a1 1 0 0 1 -.313 1.16l-.1 .068l-1.674 1.004l.063 .103a10 10 0 0 0 3.132 3.132l.102 .062l1.005 -1.672a1 1 0 0 1 1.113 -.453l.115 .039l5 2a1 1 0 0 1 .622 .807l.007 .121v4c0 1.657 -1.343 3 -3.06 2.998c-8.579 -.521 -15.418 -7.36 -15.94 -15.998a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>
                                </span>
                            </div>
                            <div className=" text-white">
                                <h3 className="text-lg font-semibold border-opacity-30 mb-1">
                                    Teléfono
                                </h3>
                                <p className="text-sm text-white opacity-70 lg:w-80">+54 9 351 - 2186616</p>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:text-left lg:gap-4 items-center">
                            <div className="shrink-0 w-12 h-12 bg-background-contact rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="text-color-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-8a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-4 5a4 4 0 0 0 -3.995 3.8l-.005 .2a4 4 0 1 0 4 -4m4.5 -1.5a1 1 0 0 0 -.993 .883l-.007 .127a1 1 0 0 0 1.993 .117l.007 -.127a1 1 0 0 0 -1 -1" /></svg>
                                </span>
                            </div>
                            <div className=" text-white">
                                <h3 className="text-lg font-semibold border-opacity-30 mb-1">
                                    Instagram
                                </h3>
                                <p className="text-sm text-white opacity-70 lg:w-80">@andrea_franceschini_lafalda</p>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:text-left lg:gap-4 items-center">
                            <div className="shrink-0 w-12 h-12 bg-background-contact rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="text-color-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-outline icon-tabler-clock"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 2.66a1 1 0 0 0 -.993 .883l-.007 .117v5l.009 .131a1 1 0 0 0 .197 .477l.087 .1l3 3l.094 .082a1 1 0 0 0 1.226 0l.094 -.083l.083 -.094a1 1 0 0 0 0 -1.226l-.083 -.094l-2.707 -2.708v-4.585l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg>
                                </span>
                            </div>
                            <div className=" text-white">
                                <h3 className="text-lg font-semibold border-opacity-30 mb-1">
                                    Horarios
                                </h3>
                                <p className="text-sm text-white opacity-70 lg:w-80">Lunes a domingos: 9:30&nbsp;-&nbsp;13:30 y 17:00&nbsp;a&nbsp;21:00</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-xl shadow-xl bg-background">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-800 font-semibold mb-1">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ingrese su nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className={`w-full p-3 bg-white border ${errors.nombre ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-emerald-600 focus:border-emerald-600 outline-none`}
                                />
                                {errors.nombre && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-800 font-semibold mb-1">
                                    Correo electrónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Ingrese su correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full p-3 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-emerald-600 focus:border-emerald-600 outline-none`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-800 font-semibold mb-1">
                                    Mensaje <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Ingrese su mensaje"
                                    rows={5}
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    className={`w-full p-3 bg-white border ${errors.mensaje ? 'border-red-500' : 'border-gray-400'} rounded-lg resize-none focus:ring-emerald-600 focus:border-emerald-600 outline-none`}
                                ></textarea>
                                {errors.mensaje && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-color-primary text-white p-3 rounded-lg font-bold hover:bg-color-primary-hover transition duration-300 flex justify-center gap-1.5 items-center">
                                Enviar Mensaje <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-whatsapp"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18.497 4.409a10 10 0 0 1 -10.36 16.828l-.223 -.098l-4.759 .849l-.11 .011a1 1 0 0 1 -.11 0l-.102 -.013l-.108 -.024l-.105 -.037l-.099 -.047l-.093 -.058l-.014 -.011l-.012 -.007l-.086 -.073l-.077 -.08l-.067 -.088l-.056 -.094l-.034 -.07l-.04 -.108l-.028 -.128l-.012 -.102a1 1 0 0 1 0 -.125l.012 -.1l.024 -.11l.045 -.122l1.433 -3.304l-.009 -.014a10 10 0 0 1 1.549 -12.454l.215 -.203a10 10 0 0 1 13.226 -.217m-8.997 3.09a1.5 1.5 0 0 0 -1.5 1.5v1a6 6 0 0 0 6 6h1a1.5 1.5 0 0 0 0 -3h-1l-.144 .007a1.5 1.5 0 0 0 -1.128 .697l-.042 .074l-.022 -.007a4.01 4.01 0 0 1 -2.435 -2.435l-.008 -.023l.075 -.041a1.5 1.5 0 0 0 .704 -1.272v-1a1.5 1.5 0 0 0 -1.5 -1.5" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Contact
