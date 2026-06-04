import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { useServerFn } from "@tanstack/react-start";
import { uploadImage } from "@/lib/cloudinary.functions";

export function ImageUpload({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const upload = useServerFn(uploadImage);

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File too large", text: "Max 10 MB" });
      return;
    }
    setBusy(true);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(new Error("Read failed"));
        r.readAsDataURL(file);
      });
      const { url } = await upload({ data: { file: dataUrl } });
      onChange(url);
      Swal.fire({ icon: "success", title: "Image uploaded", timer: 1200, showConfirmButton: false });
    } catch (e: any) {
      Swal.fire({ icon: "error", title: "Upload failed", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      {value && (
        <div className="relative mb-2 inline-block">
          <img src={value} alt="" className="h-24 w-24 object-cover rounded-lg border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {busy ? "Uploading…" : "Upload Image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <LinkIcon className="w-4 h-4 text-muted-foreground" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste image URL"
          className="flex-1 px-3 py-2 rounded-xl border bg-background text-sm"
        />
      </div>
    </div>
  );
}