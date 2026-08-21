CREATE TABLE IF NOT EXISTS rsvp (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  kehadiran TEXT NOT NULL CHECK (kehadiran IN ('Hadir', 'Tidak Hadir')),
  pesan TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp(created_at);
