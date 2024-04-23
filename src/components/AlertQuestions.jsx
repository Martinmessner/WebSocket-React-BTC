export default function AlertQuestion({ openQuestion }) {
  return (
    <>
      {openQuestion && (
        <section className="section-modal">
          <p>
            🎈Te avisara sobre cambios en el precio ayudándote a tomar
            decisiones sin tener que monitorear constantemente el mercado.
          </p>
          <p>
            🎈 Bonus Track: Recorda que podes crear cuentas alertas quieras.
          </p>
        </section>
      )}
    </>
  );
}
