export const tableComponent = () => {
    let data={}
    let tipo=1;
    let PrecedenteSuccessiva=0
    let templateGiorni = `
        <tr class="tbl1">
            <td></td>
            <td>#D</td>
            <td>#D</td>
            <td>#D</td>
            <td>#D</td>
            <td>#D</td>
        </tr>
    `;
    let parentElement;

    return {
        setData: (dato) =>{data=dato; console.log(data)},
        setParentElement: (pr) => {
            parentElement = pr;
        },
        start:(startday)=> {PrecedenteSuccessiva=startday},
        setTipo: (tip)=>{tipo=tip;},
        render: () => {
            const exportData = (date) => {
                // FUNZIONE CHE FORMATTA LA DATA
                let d = date.getDate().toString().padStart(2, '0'); // SE LEN MINORE DI 2 AGGIUNGE "0"
                let m = (date.getMonth() + 1).toString().padStart(2, '0');
                let y = date.getFullYear();
                return y + "-" + m + "-" + d;
            };
            const exportData2 = (date) => {
                // FUNZIONE CHE FORMATTA LA DATA
                let d = (date.getDate()-1).toString().padStart(2, '0'); // SE LEN MINORE DI 2 AGGIUNGE "0"
                let m = (date.getMonth() + 1).toString().padStart(2, '0');
                let y = date.getFullYear();
                return y + "-" + m + "-" + d;
            };


            const lisSett = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];
            const ore = ["8", "9", "10", "11", "12"];
            let html = templateGiorni;
            let date = new Date();
            let giornoCorrente = date.getDay() - PrecedenteSuccessiva; // serve per i bottoni precendente e succssivo

            // SE E' DOMENICA [0] OPPURE SABATO [6] passa al lunedì dopo
            if (giornoCorrente === 6) {
                date.setDate(date.getDate() + 2); 
            } else if (giornoCorrente === 0) {
                date.setDate(date.getDate() + 1); 
            } else {
                date.setDate(date.getDate() - (giornoCorrente - 1)); //PER TORNARE SEMPRE A LUNEDì 
            }

            
            lisSett.forEach((day, index) => {
                //CAMBIO HTML
                let giornoTab = day + "<br>" + exportData(date);
                html = html.replace("#D", giornoTab);

                date.setDate(date.getDate() + 1);  //GIORNO DOPO

                //AGGIUNGI CHIAVE
            });
            date.setDate(date.getDate() + -5); 
            ore.forEach(ora => {
                html += `<tr class ="tbl1">`+"<td>"+ ora +"</td>";
                for (let i = 0; i < lisSett.length; i++) {
                    let giorno=exportData(date)
                    let giorno2= exportData2(date)

                    // Trova se esiste una prenotazione per questo giorno e ora
                    let booking;
                    try{
                            booking = data.find(b => 
                            b.idType == tipo &&
                            b.date.split("T")[0] === giorno2 && // Estrae solo YYYY-MM-DD
                            b.hour == ora
                        );
                        console.log(booking)
                    }catch{console.log("err")}

                    if (booking) {
                        // se fa parte del dizionario stampa
                        html += `<td class="table-info">` + booking.name+ "</td>"; // Inserisci il nome della prenotazione
                    } else {
                        // cella vuota
                        html += `<td></td>`; // Celle vuote o con contenuto da aggiungere
                    }
                    date.setDate(date.getDate() + 1);
                }
                date.setDate(date.getDate() + -5); 
                html += `</tr>`;
            });
            
            parentElement.innerHTML = html;
        }
    }
};