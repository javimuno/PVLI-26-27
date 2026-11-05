//Probabilidads de balance (de momento) que de aquí salen tanto la escena como el simulador
export let probabilidades = {
    facil: { fallo: 10, bien: 30, perfecto: 60 },
    media: { fallo: 20, bien: 35, perfecto: 45 },
    dificil: { fallo: 30, bien: 35, perfecto: 35 }
};

export default function sortearCalidad(ataque) {
    //la dificultad es lo que determina el acierto del ataque
    let acierto = probabilidades[ataque.dificultad];
    let numero = Math.random() * 100;

    if (numero < acierto.fallo) {
        return 'fallo';
    }

    if (numero < acierto.fallo + acierto.bien) {
        return 'bien';
    }

    return 'perfecto';
}