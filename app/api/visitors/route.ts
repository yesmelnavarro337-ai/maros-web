import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Archivo de persistencia de contador
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");

// Valor base inicial de visitantes
const INITIAL_VISITORS = 1248;

let inMemoryCount = INITIAL_VISITORS;
let isInitialized = false;

async function ensureDataFile(): Promise<number> {
  if (isInitialized) return inMemoryCount;

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
    // Si no existe, crear con conteo inicial
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify({ count: INITIAL_VISITORS }), "utf-8");
    } catch {}
    inMemoryCount = INITIAL_VISITORS;
  }

  isInitialized = true;
  return inMemoryCount;
}

async function persistCount(count: number): Promise<void> {
  inMemoryCount = count;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({ count, updatedAt: new Date().toISOString() }), "utf-8");
  } catch (err) {
    console.error("Error persistiendo visitantes:", err);
  }
}

export async function GET() {
  const count = await ensureDataFile();
  return NextResponse.json({ count });
}

export async function POST() {
  let count = await ensureDataFile();
  count += 1;
  await persistCount(count);
  return NextResponse.json({ count });
}
