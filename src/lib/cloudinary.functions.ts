import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "crypto";

const CLOUD_NAME = "dnbqaqcjl";
const API_KEY = "643748125297642";
const API_SECRET = "8QTr-pgalU2ivbv7ReMDdHnqgnQ";

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        file: z.string().min(20).max(15_000_000),
        folder: z.string().max(64).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = data.folder || "affan";
    const toSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    const fd = new FormData();
    fd.append("file", data.file);
    fd.append("api_key", API_KEY);
    fd.append("timestamp", timestamp);
    fd.append("folder", folder);
    fd.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd },
    );
    const json: any = await res.json();
    if (!res.ok || !json.secure_url) {
      throw new Error(json?.error?.message || "Cloudinary upload failed");
    }
    return { url: json.secure_url as string };
  });