import { put } from "@vercel/blob"

export async function uploadToBlob(file: File) {
  const blob = await put(file.name, file, {
    access: "public",
  })

  return blob.url
}

// Replace the blobImageUrls object with reliable placeholder URLs
export const blobImageUrls = {
  heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  mathFramework: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
  creativeProcess: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop",
  element1: "public/20250430_1911_Electric Scooter Adventure_simple_compose_01jt3tttmjf6zscv5q0akmsgae.png",
  element2: "public/20250430_1911_Sleek Sports Watch_simple_compose_01jt3tsk1vf45v76j385gd5nag.png",
  element3: "public/20250430_1912_Golden Hour Perfume_simple_compose_01jt3twqhxezcvzt8mmy438c6g.png",
  element4: "public/20250430_1914_Levitating Wireless Earbuds_simple_compose_01jt3v04rveejbzs8jmhbm13b2.png",
  element5: "public/20250430_1915_Solar Roof Innovation_simple_compose_01jt3v39sce7sbeh3cmx1ypbpb.png",
  element6: "public/20250430_1916_Gourmet Chocolate Indulgence_simple_compose_01jt3v558vezcb0q755q8amjgb.png",
}
