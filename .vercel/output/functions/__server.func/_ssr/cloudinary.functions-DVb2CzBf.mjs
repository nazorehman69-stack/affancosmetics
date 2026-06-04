import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-AdF8M1aR.mjs";
import require$$1 from "crypto";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const CLOUD_NAME = "dnbqaqcjl";
const API_KEY = "643748125297642";
const API_SECRET = "8QTr-pgalU2ivbv7ReMDdHnqgnQ";
const uploadImage_createServerFn_handler = createServerRpc({
  id: "517e57626f28d980da370f8a4c53b0e50df7fe8917f6b2c47c9e1d36a65a4adb",
  name: "uploadImage",
  filename: "src/lib/cloudinary.functions.ts"
}, (opts) => uploadImage.__executeServer(opts));
const uploadImage = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  file: stringType().min(20).max(15e6),
  folder: stringType().max(64).optional()
}).parse(input)).handler(uploadImage_createServerFn_handler, async ({
  data
}) => {
  const timestamp = Math.floor(Date.now() / 1e3).toString();
  const folder = data.folder || "affan";
  const toSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = require$$1.createHash("sha1").update(toSign).digest("hex");
  const fd = new FormData();
  fd.append("file", data.file);
  fd.append("api_key", API_KEY);
  fd.append("timestamp", timestamp);
  fd.append("folder", folder);
  fd.append("signature", signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: fd
  });
  const json = await res.json();
  if (!res.ok || !json.secure_url) {
    throw new Error(json?.error?.message || "Cloudinary upload failed");
  }
  return {
    url: json.secure_url
  };
});
export {
  uploadImage_createServerFn_handler
};
