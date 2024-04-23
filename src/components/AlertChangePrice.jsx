import { useEffect, useState } from "react";
import AlertQuestion from "./AlertQuestions";

export default function ChangePrice({ dataBtc }) {
  const [openAlert, SetopenAlert] = useState(false);
  const [valor, Setvalor] = useState("");

  const [playSound, SetplaySound] = useState(false);
  const [testMessage, SettestMessage] = useState([]);

  const changeOpenAlert = () => {
    SetopenAlert(!openAlert);
  };

  const deleteAlert = (index) => {
    SettestMessage((prevState) => {
      return prevState.filter((_, i) => i !== index);
    });
  };

  const testMap = testMessage.map((data) => data.valor);

  useEffect(() => {
    if (testMap.includes(dataBtc)) {
      SetplaySound(true);

      setTimeout(() => {
        SetplaySound(false);
      }, 2000);
    }
  }, [dataBtc, testMap]);

  /*
  LO puedo Eliminar creo
  useEffect(() => {
    if (valor === dataBtc && valor > 0) {
      SetplaySound(true);

      SettestMessage((prevState) => [
        ...prevState,
        { valor: valor, completed: true, message: "" },
      ]);

      SetviewMessageAlerta(true);

      // Setvalor("");

      setTimeout(() => {
        SetplaySound(false);
      }, 3000);
    }
  }, [valor, dataBtc]);

*/
  const handleSubmit = (event) => {
    event.preventDefault();

    if (valor < 0) return;

    if (valor > 0) {
      SettestMessage((prevState) => [
        ...prevState,
        { valor: valor, completed: true },
      ]);
    }
  };

  return (
    <>
      <section className="section-alerts-change">
        <button onClick={changeOpenAlert}>Crear Alerta</button>
        <AlertQuestion />
      </section>
      {openAlert && (
        <form className="form-alert" onSubmit={handleSubmit}>
          <input
            placeholder="Ingrese un valor"
            value={valor}
            onChange={(e) => Setvalor(e.target.value)}
            type="number"
            required
            min="0"
          ></input>
          <button>Guardar</button>
        </form>
      )}
      {playSound && <audio src="/phone-vibrator.wav" autoPlay></audio>}

      <section className="alerts-created">
        {testMessage.length > 0 &&
          testMessage.map((data, index) => {
            const { valor } = data;
            return (
              <div key={index}>
                <p>Alerta N°: {index + 1}</p>
                <p>Valor: {valor}</p>

                <button onClick={() => deleteAlert(index)}>
                  <img width="30px" src="/delete2.png"></img>
                </button>
              </div>
            );
          })}
      </section>
    </>
  );
}
