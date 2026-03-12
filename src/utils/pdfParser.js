import * as pdfjsLib from "pdfjs-dist";

async function extractText(file) {

  // Read pdf this can be by array buffer and as well as pdf reader 
  const buffer = await file.arrayBuffer();

  // Load pdf
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

import * as pdfjsLib from "pdfjs-dist";

async function extractText(file) {

  // Read pdf
  const buffer = await file.arrayBuffer();

  // Load pdf
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

export async function extractText(file)