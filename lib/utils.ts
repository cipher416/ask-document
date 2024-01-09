import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getTextFromPDF(path: string) {
  const pdfjs = await import('pdfjs-dist')
  let doc = await pdfjs.getDocument(path).promise;
  let page1 = await doc.getPage(1);
  let content = await page1.getTextContent();
  let strings = content.items.map(function(item: any) {
      return item.str;
  });
  return strings.join(" ");
}
