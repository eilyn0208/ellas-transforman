import AppLayout from "@/components/AppLayout";
import AppHeader from "@/components/AppHeader";

export default function TermsPage() {
  return (
    <AppLayout showNav={false} bg="bg-white">
      <AppHeader showBack title="Términos de Servicio" />

      <main className="flex-1 px-6 py-8 space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">1. Aceptación de los términos</h2>
          <p>
            Al acceder y usar EllasTransforman aceptas quedar vinculada por estos Términos de
            Servicio. Si no estás de acuerdo, no uses la plataforma.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">2. Uso de la plataforma</h2>
          <p>
            EllasTransforman es una plataforma de mentoría profesional. Te comprometes a usar el
            servicio de manera ética, respetando a mentoras, mentees y la comunidad.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">3. Cuentas de usuario</h2>
          <p>
            Eres responsable de mantener la confidencialidad de tu cuenta y de todas las
            actividades que ocurran bajo ella.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">4. Sesiones de mentoría</h2>
          <p>
            Las sesiones agendadas deben cancelarse con al menos 12 horas de anticipación.
            EllasTransforman no se hace responsable por el contenido de las sesiones privadas
            entre mentoras y mentees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">5. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de actualizar estos términos en cualquier momento.
            Te notificaremos sobre cambios significativos a través de la plataforma.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">6. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos términos, contáctanos en{" "}
            <span className="text-brand font-medium">technogirls05@gmail.com</span>
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-4">Última actualización: junio 2025</p>
      </main>
    </AppLayout>
  );
}
