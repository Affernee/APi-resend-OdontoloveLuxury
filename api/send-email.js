export default async function handler(req, res) {
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
        from: "clinica@odontoloveluxury.com",
        to: "clinicadentalodontolove@gmail.com",
        subject: "Nueva Reserva para el Evento Infantil",
        text: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
