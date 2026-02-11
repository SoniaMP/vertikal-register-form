import Image from "next/image";

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <Image
          src="/logo-horizontal-color.png"
          alt="Club Vertikal"
          width={200}
          height={40}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="text-2xl font-bold sm:text-3xl">Registro de socio</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Completa el formulario para registrarte en el Club Vertikal
        </p>
      </div>
      {children}
    </div>
  );
}
