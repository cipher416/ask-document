import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getTextFromPDF(path: string) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.7.570/build/pdf.worker.min.js";
  let doc = await pdfjs.getDocument(path).promise;
  let pages = doc.numPages;
  let pageContents = '';
  for (let i = 0; i < pages; i++) {
    let page1 = await doc.getPage(i + 1);
    let content = await page1.getTextContent();
    let strings = content.items.map(function(item: any) {
        return item.str;
    });
    pageContents += strings.join(" ");
  }
  return pageContents;
}
