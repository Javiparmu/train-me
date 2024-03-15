import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="py-16">
      <div className="mx-56 px-4 md:px-6">
        <div className="grid grid-cols-2 gap-6">
          <figure className="flex justify-end lg:order-last">
            <Image
              alt="Hero Image"
              className="overflow-hidden sm:w-[450px]"
              src="/images/hero-image.png"
              width={3863}
              height={2578}
            />
          </figure>
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Encuentra al entrenador personal perfecto para ti
              </h1>
              <p className="max-w-[470px] text-gray-500 md:text-xl dark:text-gray-400 font-light">
                Tenemos a tu entrenador ideal y está esperando a que le contactes.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                className="inline-flex h-12 w-42 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Buscar entrenador
              </Link>
              <Link
                className="inline-flex h-12 w-42 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="/auth/signin"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
