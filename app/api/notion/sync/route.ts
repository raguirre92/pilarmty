import { revalidatePath, revalidateTag } from "next/cache";
import { shouldInvalidateNotionFallback } from "@/lib/content-cache-policy";
import { getPayload } from "payload";

import { runNotionPayloadSync } from "@/lib/notion-payload-reconcile";
import { recordSyncRun } from "@/lib/sync-history";
import config from "@payload-config";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

async function execute(trigger: "manual" | "cron") {
  const payload = await getPayload({ config });
  const result = await runNotionPayloadSync(payload);

  const entry = {
    id: result.runId || `sync_${Date.now().toString(36)}`,
    finishedAt: result.finishedAt || new Date().toISOString(),
    status: result.errors.length > 0 ? ("incident" as const) : ("ready" as const),
    trigger,
    payloadToNotion: result.payloadToNotion,
    notionToPayload: result.notionToPayload,
    createdInNotion: result.createdInNotion,
    unchanged: result.unchanged,
    skipped: result.skipped,
    errors: result.errors
  };

  const history = await recordSyncRun(entry);

  if (shouldInvalidateNotionFallback(process.env.CONTENT_SOURCE, result.notionToPayload)) {
    revalidateTag("notion-content", "max");
    revalidatePath("/", "layout");
  }
  return Response.json({
    ok: result.errors.length === 0,
    result,
    entry,
    history
  }, {
    status: result.errors.length === 0 ? 200 : 207
  });
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    return await execute("cron");
  } catch (error) {
    const errorEntry = {
      id: `sync_${Date.now().toString(36)}`,
      finishedAt: new Date().toISOString(),
      status: "error" as const,
      trigger: "cron" as const,
      payloadToNotion: 0,
      notionToPayload: 0,
      createdInNotion: 0,
      unchanged: 0,
      skipped: 0,
      errors: [{ message: error instanceof Error ? error.message : String(error) }]
    };
    const history = await recordSyncRun(errorEntry);

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
        entry: errorEntry,
        history
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: request.headers });
  if (!auth.user) {
    return Response.json({ error: "Sesión administrativa requerida" }, { status: 401 });
  }

  try {
    return await execute("manual");
  } catch (error) {
    const errorEntry = {
      id: `sync_${Date.now().toString(36)}`,
      finishedAt: new Date().toISOString(),
      status: "error" as const,
      trigger: "manual" as const,
      payloadToNotion: 0,
      notionToPayload: 0,
      createdInNotion: 0,
      unchanged: 0,
      skipped: 0,
      errors: [{ message: error instanceof Error ? error.message : String(error) }]
    };
    const history = await recordSyncRun(errorEntry);

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
        entry: errorEntry,
        history
      },
      { status: 500 }
    );
  }
}

