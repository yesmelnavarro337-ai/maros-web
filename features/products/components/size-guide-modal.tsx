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
      <DialogContent className="max-w-md bg-[#F9F6F0] text-[#3B4228] border-[#3B4228]/15">
        <DialogHeader>
          <DialogTitle className="text-[#3B4228]">Guía de tallas</DialogTitle>
          <DialogDescription className="text-[#3B4228]/70">
            Medidas en centímetros
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-[#3B4228]/15">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#3B4228] text-[#F9F6F0]">
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
                  className="border-t border-[#3B4228]/10 last:border-b-0"
                >
                  <td className="px-3.5 py-2.5 font-medium text-[#3B4228]">
                    {row.measurement}
                  </td>
                  {SIZE_GUIDE_SIZES.map((s) => (
                    <td key={s} className="px-3.5 py-2.5 text-center tabular-nums text-[#3B4228]">
                      {row[s]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[#3B4228]/60 leading-relaxed">{SIZE_GUIDE_NOTE}</p>
      </DialogContent>
    </Dialog>
  );
}