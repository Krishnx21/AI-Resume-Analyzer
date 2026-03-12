import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractText(file) {

  // read uploaded file as binary data and  this can be by array buffer and as well as pdf reader 
  const buffer = await file.arrayBuffer();

  // load pdf using pdfjs
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let fullText = "";

  // Loop pages
  for (let i = 1; i <= pdf.numPages; i++) {

    const page = await pdf.getPage(i);

    const content = await page.getTextContent();

    // collect text
    const text = content.items.map(item => item.str).join(" ");

    fullText += text + " ";

  }

  return fullText;
}
