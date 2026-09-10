import { serverApiFetch } from "@/lib/api/server-fetch";
import type { FaqItem } from "../types";

interface ApiFaqItem {
  question: string;
  answer: string;
}

function adaptFaq(item: ApiFaqItem, index: number): FaqItem {
  return {
    id: `faq-${index}`,
    question: item.question,
    answer: item.answer,
  };
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const items = await serverApiFetch<ApiFaqItem[]>("faq");
  return items.map(adaptFaq);
}