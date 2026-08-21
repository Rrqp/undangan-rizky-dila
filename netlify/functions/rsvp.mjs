import { getStore } from "@netlify/blobs";

const store = getStore("wedding-rsvp");

const EMPTY = {
  hadir: 0,
  tidakHadir: 0,
  messages: []
};

async function readData() {
  const data = await store.get("data", { type: "json" });
  if (!data || typeof data !== "object") return structuredClone(EMPTY);

  return {
    hadir: Number(data.hadir) || 0,
    tidakHadir: Number(data.tidakHadir) || 0,
    messages: Array.isArray(data.messages) ? data.messages : []
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export default async (request) => {
  try {
    if (request.method === "OPTIONS") {
      return new Response("", {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method === "GET") {
      return json(await readData());
    }

    if (request.method !== "POST") {
      return json({ success: false, error: "Method tidak didukung." }, 405);
    }

    const body = await request.json();

    const nama = String(body?.nama || "").trim().slice(0, 80);
    const kehadiran = body?.kehadiran === "Hadir" ? "Hadir" : "Tidak Hadir";
    const pesan = String(body?.pesan || "").trim().slice(0, 1000);

    if (!nama || !pesan) {
      return json({ success: false, error: "Nama dan pesan wajib diisi." }, 400);
    }

    const data = await readData();

    if (kehadiran === "Hadir") data.hadir += 1;
    else data.tidakHadir += 1;

    data.messages.unshift({
      nama,
      kehadiran,
      pesan,
      waktu: new Date().toISOString()
    });

    // Keep the latest 200 messages.
    data.messages = data.messages.slice(0, 200);

    await store.setJSON("data", data);

    return json({ success: true, ...data });
  } catch (error) {
    console.error(error);
    return json({
      success: false,
      error: "Server error. Cek Netlify Function logs."
    }, 500);
  }
};

