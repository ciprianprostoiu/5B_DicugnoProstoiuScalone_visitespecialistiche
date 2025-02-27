export const createForm = (parentElement, pubsub) => {
    let dato = {};
    let callback = null;
    let tipo=1;
    return {
        setLabels: (labels) => { dato = labels; }, 
        onsubmit: (callbackInput) => { callback = callbackInput; },
        setType: (tip)=>{tipo=tip;},
        exportDiz: () => {
            
        },
        render: () => {
            const exportData = (date) => {
                // FUNZIONE CHE FORMATTA LA DATA
                let d = (date.getDate()-1).toString().padStart(2, '0'); // SE LEN MINORE DI 2 AGGIUNGE "0"
                let m = (date.getMonth() + 1).toString().padStart(2, '0');
                let y = date.getFullYear();
                return y + "-" + m + "-" + d;
            };
            //creazione input
            parentElement.innerHTML = 
                `<div>Data<br/><input id="data" type="date" class="form-label form-control"/></div>` +
                `<div>Ora<br/><select id="ora" name="ora" class="form-select"><option value=8>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option></select></div>` +
                `<div>Nome<br/><input id="nome" type="text" class="form-label form-control"/></div>`+
                `<div id="outputform"></div>`
            //lettura valori inseriti
            document.querySelector("#Prenota").onclick = () => {
                const data = document.querySelector("#data").value;
                const ora = document.querySelector("#ora").value;
                const nome = document.querySelector("#nome").value;
                
                
                const outputform = document.getElementById("outputform");

                let date = new Date(data);
                let giornoCorrente = date.getDay()
                if (data === "" || ora === "" || nome === "" || giornoCorrente === 0 || giornoCorrente === 6) {
                    outputform.innerHTML = "KO";
                } else {
                    // AGGIUNTA DELLA DATA NEL DIZIONARIO
                    const datasenzatrattini = exportData(date)
                    const result={}
                    let booking;
                    try{
                            booking = dato.find(b => 
                            b.idType == tipo &&
                            b.date.split("T")[0] === datasenzatrattini && // Estrae solo YYYY-MM-DD
                            b.hour == ora
                        );
                    }catch{console.log("err")}

                    if(booking){
                        outputform.innerHTML="KO";
                        console.log("ok")
                    }
                    else{
                        outputform.innerHTML = "OK";
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        const dizTemp = {
                            "idType": tipo,
                            "date": data,
                            "hour": Number(ora),
                            "name": nome
                        }
                        // pubblico l'evento
                        pubsub.publish("InsertData", dizTemp);

                        console.log("Dati inviati al server:", dizTemp);
                        fetch("/insert", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(dizTemp)
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Risposta dal server:", data);
                            if (data.result === "ok") {
                                outputform.innerHTML = "OK";
                            } else {
                                outputform.innerHTML = "KO";
                            }
                        })
                        .catch(error => {
                            console.error("Errore nell'invio dei dati:", error);
                            outputform.innerHTML = "Errore!";
                        });
                        
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    }
                }

                document.querySelector("#data").value="";
                document.querySelector("#ora").value=8;
                document.querySelector("#nome").value="";

                }
            }

        }
    };
