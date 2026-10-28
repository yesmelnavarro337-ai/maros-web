"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SIZE_GUIDE_NOTE, SIZE_GUIDE_ROWS, SIZE_GUIDE_SIZES } from "../data/size-guide";

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          <Ruler className="h-3.5 w-3.5" />
          Guía de tallas
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Guía de tallas</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Medidas en centímetros
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left font-medium px-3.5 py-2.5">Medida</th>
                {SIZE_GUIDE_SIZES.map((s) => (
                  <th key={s} className="text-center font-medium px-3.5 py-2.5">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_ROWS.map((row) => (
                <tr
                  key={row.measurement}
                  className="border-t border-border/60 last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-3.5 py-2.5 font-medium text-foreground">
                    {row.measurement}
                  </td>
                  {SIZE_GUIDE_SIZES.map((s) => (
                    <td key={s} className="px-3.5 py-2.5 text-center tabular-nums text-foreground/90">
                      {row[s]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{SIZE_GUIDE_NOTE}</p>
      </DialogContent>
    </Dialog>
  );
}