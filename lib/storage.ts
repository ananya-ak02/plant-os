import { createSupabaseServerClient } from "./supabase";

export async function uploadPlantImage(file: File, folder: "plant-photos" | "community" = "plant-photos") {
  const supabase = createSupabaseServerClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : "jpg";
  const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${safeExtension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("plantos").upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("plantos").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl, buffer };
}
