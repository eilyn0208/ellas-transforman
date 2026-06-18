import AppLayout from "@/components/AppLayout";
import AppHeader from "@/components/AppHeader";

export default function PrivacyPage() {
  return (
    <AppLayout showNav={false} bg="bg-white">
      <AppHeader showBack title="Política de Privacidad" />

      <main className="flex-1 px-6 py-8 space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">1. Información que recopilamos</h2>
          <p>
            Al iniciar sesión con Google recopilamos tu nombre, dirección de correo electrónico e
            imagen de perfil. No almacenamos contraseñas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">2. Cómo usamos tu información</h2>
          <p>
            Usamos tu información para personalizar tu experiencia de mentoría, conectarte con
            mentoras y mejorar la plataforma. No vendemos ni compartimos tus datos con terceros.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">3. Almacenamiento y seguridad</h2>
          <p>
            Tu información se almacena de forma segura a través de Supabase. Implementamos
            medidas de seguridad estándar de la industria para proteger tus datos.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">4. Tus derechos</h2>
          <p>
            Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier
            momento desde la configuración de tu perfil o contactándonos directamente.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">5. Cookies</h2>
          <p>
            Usamos cookies esenciales para mantener tu sesión activa. No usamos cookies de
            rastreo publicitario.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base text-gray-900">6. Contacto</h2>
          <p>
            Para ejercer tus derechos o resolver dudas sobre privacidad, escríbenos a{" "}
            <span className="text-brand font-medium">technogirls05@gmail.com</span>
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-4">Última actualización: junio 2025</p>
      </main>
    </AppLayout>
  );
}
