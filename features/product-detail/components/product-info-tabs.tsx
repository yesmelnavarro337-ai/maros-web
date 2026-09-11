"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";

const FABRIC_FEATURES = [
  "Telas suaves y frescas, ideales para dormir cómodamente toda la noche",
  "Confección limpia con costuras reforzadas en zona de máximo rozamiento",
  "Tejidos con buen mantenimiento del color tras varios lavados",
  "Elasticidad y caída pensadas para adaptarse al cuerpo sin apretar",
  "Materiales seleccionados pensando en pieles sensibles",
];

const CARE_TIPS = [
  "Lavar en agua fría con ciclo delicado",
  "No usar blanqueador ni cloro",
  "Evitar planchar directamente sobre estampados y bordados",
  "Secar a la sombra para conservar los colores",
  "Guardar en lugar seco y ventilado",
];

export function ProductInfoTabs({ description }: { description: string }) {
  return (
    <div className="mt-12">
      <Accordion type="multiple" defaultValue={["descripcion"]}>
        <AccordionItem value="descripcion">
          <AccordionTrigger className="font-heading text-lg text-foreground hover:no-underline">
            Descripción
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tela">
          <AccordionTrigger className="font-heading text-lg text-foreground hover:no-underline">
            Características de la tela
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {FABRIC_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cuidados">
          <AccordionTrigger className="font-heading text-lg text-foreground hover:no-underline">
            Cuidados de la prenda
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {CARE_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}