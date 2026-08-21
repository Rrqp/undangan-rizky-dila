import { getStore } from "@netlify/blobs";

const store = getStore("rizky-dila-rsvp");

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(data, status=200){
  return new Response(JSON.stringify(data), {status, headers});
}

export default async (req) => {
  try {
    if(req.method === "GET"){
      const data = await store.get("all", { type: "json" });
      const messages = Array.isArray(data?.messages) ? data.messages : [];
      const hadir = messages.filter(x=>x.kehadiran==="Hadir").length;
      const tidakHadir = messages.filter(x=>x.kehadiran==="Tidak Hadir").length;
      return json({stats:{hadir, tidakHadir, total:messages.length}, messages:[...messages].reverse()});
    }

    if(req.method === "POST"){
      const body = await req.json();
      const nama = String(body.nama||"").trim();
      const kehadiran = String(body.kehadiran||"").trim();
      const pesan = String(body.pesan||"").trim();
      if(!nama || !pesan) return json({error:"Nama dan pesan wajib diisi."},400);
      if(!["Hadir","Tidak Hadir"].includes(kehadiran)) return json({error:"Status kehadiran tidak valid."},400);
      if(nama.length>100 || pesan.length>1000) return json({error:"Input terlalu panjang."},400);

      const current = await store.get("all", {type:"json"});
      const messages = Array.isArray(current?.messages) ? current.messages : [];
      messages.push({id:crypto.randomUUID(),nama,kehadiran,pesan,createdAt:new Date().toISOString()});
      await store.setJSON("all",{messages});

      return json({ok:true},201);
    }
    return json({error:"Method tidak didukung."},405);
  } catch(e) {
    console.error(e);
    return json({error:"Server RSVP sedang bermasalah."},500);
  }
};
