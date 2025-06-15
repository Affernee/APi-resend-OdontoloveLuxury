export default async function handler(req, res) {
  // Habilita CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // CORS preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    nombre_nino,
    edad_nino,
    experiencia,
    nombre_padre,
    telefono,
    email,
    fotos,
    fecha,
    horario,
    confirmacion1,
    confirmacion2,
  } = req.body;

  const message = `
Nueva reserva para el evento dental:

👶 Niño:
- Nombre: ${nombre_nino}
- Edad: ${edad_nino}
- Experiencia: ${experiencia}

👨‍👩‍👧 Tutor:
- Nombre: ${nombre_padre}
- Teléfono: ${telefono}
- Email: ${email || "No proporcionado"}
- Autoriza fotos: ${fotos}

📅 Fecha: ${fecha}
🕐 Horario: ${horario}

✅ Confirmaciones:
- Acepta condiciones: ${confirmacion1 ? "Sí" : "No"}
- Puntualidad: ${confirmacion2 ? "Sí" : "No"}
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "clinica@odontoloveluxury.com", // Cambia por tu remitente verificado
        to: "clinicadentalodontolove@gmail.com", // Tu destino real
        subject: "Nueva Reserva para el Evento Infantil",
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ error: errorData });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
