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
  element1: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  element2: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=800&auto=format&fit=crop",
  element3: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  element4: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
  element5: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=800&auto=format&fit=crop",
  element6: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
}
