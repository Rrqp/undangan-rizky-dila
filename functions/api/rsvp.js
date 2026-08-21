export async function onRequest(context) {
  const { request, env } = context;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });

  try {
    if (!env.DB) {
      return json({ success:false, error:"Database belum terhubung. Pasang D1 binding dengan nama DB." }, 500);
    }

    if (request.method === "GET") {
      const { results = [] } = await env.DB
        .prepare("SELECT id, nama, kehadiran, pesan, created_at AS createdAt FROM rsvp ORDER BY created_at DESC")
        .all();

      const hadir = results.filter(x => x.kehadiran === "Hadir").length;
      const tidakHadir = results.filter(x => x.kehadiran === "Tidak Hadir").length;

      return json({
        success: true,
        hadir,
        tidakHadir,
        total: results.length,
        messages: results
      });
    }

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const nama = String(body.nama || "").trim();
      const kehadiran = String(body.kehadiran || "").trim();
      const pesan = String(body.pesan || "").trim();

      if (!nama || !pesan)
        return json({ success:false, error:"Nama dan pesan wajib diisi." }, 400);

      if (!["Hadir","Tidak Hadir"].includes(kehadiran))
        return json({ success:false, error:"Status kehadiran tidak valid." }, 400);

      if (nama.length > 100 || pesan.length > 1000)
        return json({ success:false, error:"Input terlalu panjang." }, 400);

      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      await env.DB.prepare(
        "INSERT INTO rsvp (id, nama, kehadiran, pesan, created_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(id, nama, kehadiran, pesan, createdAt).run();

      const counts = await env.DB.prepare(`
        SELECT
          SUM(CASE WHEN kehadiran = 'Hadir' THEN 1 ELSE 0 END) AS hadir,
          SUM(CASE WHEN kehadiran = 'Tidak Hadir' THEN 1 ELSE 0 END) AS tidakHadir,
          COUNT(*) AS total
        FROM rsvp
      `).first();

      return json({
        success:true,
        hadir:Number(counts?.hadir || 0),
        tidakHadir:Number(counts?.tidakHadir || 0),
        total:Number(counts?.total || 0)
      });
    }

    return json({success:false,error:"Method tidak didukung."},405);
  } catch (error) {
    console.error(error);
    return json({success:false,error:"Server RSVP sedang bermasalah."},500);
  }
}

