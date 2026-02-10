"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DataProtectionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DataProtectionDialog({
  isOpen,
  onOpenChange,
}: DataProtectionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Protección de datos</DialogTitle>
          <DialogDescription>
            Protección de datos personales
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 text-sm leading-relaxed max-h-[60vh] space-y-5">
          <p>
            De conformidad con lo dispuesto en el Reglamento (UE) 2016/679
            (RGPD) y en la Ley Orgánica 3/2018, se informa de que los datos
            personales facilitados en la presente ficha serán tratados por
            VERTIKAL, con domicilio en C/ Espronceda, 16 2-B, CP 30140,
            Santomera (Murcia), en su condición de responsable del tratamiento.
          </p>

          <section>
            <h3 className="mb-1 font-semibold">
              Finalidad y base jurídica del tratamiento
            </h3>
            <p>
              Los datos serán tratados con la finalidad de gestionar la
              inscripción del interesado y la organización y desarrollo de las
              actividades del club, siendo la base legal la ejecución de la
              relación asociativa (art. 6.1.b RGPD).
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">Cesión de datos</h3>
            <p>
              Para la tramitación de licencias y seguros deportivos, los datos
              necesarios serán comunicados a la Federación de Montañismo de la
              Región de Murcia y/o a la Federación de Espeleología de la Región
              de Murcia, así como a sus respectivas entidades aseguradoras.
              Dicha cesión resulta necesaria para la participación en las
              actividades federadas.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">
              Tratamiento de imágenes (consentimiento)
            </h3>
            <p>
              Autorizo el uso de mi imagen obtenida durante las actividades del
              club para su publicación en la página web, redes sociales y otros
              medios de difusión propios del club, siempre con fines
              informativos y sin finalidad comercial.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">Derechos del interesado</h3>
            <p>
              El interesado podrá ejercer los derechos de acceso,
              rectificación, supresión, oposición, limitación del tratamiento y
              portabilidad, así como retirar el consentimiento en cualquier
              momento, mediante solicitud escrita dirigida a VERTIKAL en la
              dirección indicada o al correo electrónico{" "}
              <a
                href="mailto:gestion@clubvertikal.es"
                className="text-primary underline underline-offset-2"
              >
                gestion@clubvertikal.es
              </a>
              .
            </p>
          </section>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
