import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Archivo de persistencia de contador
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");

// Piso base obligatorio de visitantes: si la persistencia no existe,
// está corrupta o registra una cifra menor, se inicializa en 500.
const INITIAL_VISITORS = 500;

let inMemoryCount = INITIAL_VISITORS;
let isInitialized = false;

async function ensureDataFile(): Promise<void> {
  if (isInitialized) return;

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (typeof parsed.count === "number" && parsed.count >= INITIAL_VISITORS) {
      inMemoryCount = parsed.count;
    } else {
      inMemoryCount = INITIAL_VISITORS;
      await fs.writeFile(DATA_FILE, JSON.stringify({ count: inMemoryCount }), "utf-8");
    }
  } catch {
    // Si no existe o está corrupto, crear con el piso base
    inMemoryCount = INITIAL_VISITORS;
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify({ count: inMemoryCount }), "utf-8");
    } catch {}
  }

  isInitialized = true;
}

async function incrementCount(): Promise<number> {
  await ensureDataFile();
  const count = inMemoryCount + 1;
  inMemoryCount = count;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({ count, updatedAt: new Date().toISOString() }), "utf-8");
  } catch (err) {
    console.error("Error persistiendo visitantes:", err);
  }
  return count;
}

// Cada petición (carga de página, recarga manual o actualización de ruta)
// incrementa incondicionalmente el contador en +1, sin filtros por IP,
// cookies, almacenamiento local ni huella del dispositivo.
export async function GET() {
  const count = await incrementCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = await incrementCount();
  return NextResponse.json({ count });
}
