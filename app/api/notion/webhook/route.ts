import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { shouldInvalidateNotionFallback } from "@/lib/content-cache-policy";
import { getPayload } from "payload";

import { syncNotionPage } from "@/lib/notion";
import { reconcileNotionPage } from "@/lib/notion-payload-reconcile";
import config from "@payload-config";

function validSignature(rawBody: string, signature: string | null) {
  const token = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN;
  if (!token || !signature) return false;
  const expected = `sha256=${createHmac("sha256", token)
    .update(rawBody)
    .digest("hex")}`;
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  let payload: {
    verification_token?: string;
    entity?: { id?: string };
    type?: string;
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (payload.verification_token) {
    return Response.json({
      verification_token: payload.verification_token
    });
  }

  if (!validSignature(rawBody, request.headers.get("x-notion-signature"))) {
    return Response.json({ error: "invalid_signature" }, { status: 401 });
  }

  const pageId = payload.entity?.id;
  if (pageId && payload.type?.startsWith("page.")) {
    await syncNotionPage(pageId);
    const cms = await getPayload({ config });
    await reconcileNotionPage(cms, pageId);
  }

  if (pageId && payload.type?.startsWith("page.") &&
      shouldInvalidateNotionFallback(process.env.CONTENT_SOURCE, 1)) {
    revalidateTag("notion-content", "max");
    revalidatePath("/", "layout");
  }
  return Response.json({ ok: true });
}
