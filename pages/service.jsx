import { useEffect } from "react";
import { useRouter } from "next/router";
import { getServiceByMode } from "../lib/catalog";

export default function LegacyServicePage() {
  const router = useRouter();

  useEffect(() => {
    const mode = router.query.mode;
    const service = getServiceByMode(mode);
    if (service) {
      router.replace(`/order/${service.id}`);
    } else if (router.isReady) {
      router.replace("/services");
    }
  }, [router]);

  return (
    <main className="layout">
      <section className="panel section-spacing">
        <h2>Redirection en cours...</h2>
        <p>Nous vous redirigeons vers le nouveau formulaire.</p>
      </section>
    </main>
  );
}
