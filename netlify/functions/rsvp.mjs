
export default async (req) => {
  try {
    if (req.method === "GET") {
      return new Response(
        JSON.stringify({
          success: true,
          hadir: 0,
          tidakHadir: 0,
          messages: []
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (req.method === "POST") {
      const data = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Data berhasil diterima",
          data
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Method tidak diperbolehkan"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
