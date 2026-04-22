import fetch from "node-fetch";
import JSZip from "jszip";

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN as string;

export const deployToNetlify = async (
  html: string,
  css: string,
  js: string
) => {
  const zip = new JSZip();
  console.log("hii from zip")
 

  zip.file("index.html", html);
  if (css) zip.file("style.css", css);
  if (js) zip.file("script.js", js);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  const response = await fetch("https://api.netlify.com/api/v1/sites", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NETLIFY_TOKEN}`,
      "Content-Type": "application/zip",
    },
    body: zipBuffer,
  });

  const data:any = await response.json();

  return data.url; 
}; 