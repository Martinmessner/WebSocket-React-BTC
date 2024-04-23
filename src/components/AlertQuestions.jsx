import { useState } from "react";

export default function AlertQuestion() {
  const [openQuestion, SetopenQuestion] = useState(false);

  const openQuestionClick = () => {
    SetopenQuestion(!openQuestion);
  };

  return (
    <>
      <img
        onClick={openQuestionClick}
        src="/help.png"
        title="¿Que es una Alerta?"
        alt="¿Que es una Alerta?"
      ></img>

      {openQuestion && (
        <section className="section-modal">
          <p>
            🎈 Una alerta en Bitcoin te avisa sobre cambios importantes en el
            precio o actividad de la criptomoneda, ayudándote a tomar decisiones
            informadas en el mercado 🎈
          </p>
          <p>
            🎈 Vas a poder estar al tanto de oportunidades de compra o venta sin
            tener que monitorear constantemente el mercado, ahorrándote tiempo y
            ayudándote a tomar decisiones más estratégicas 🎈
          </p>
          <p>Recorda que podes crear cuentas alertas quieras.</p>
        </section>
      )}
    </>
  );
}
