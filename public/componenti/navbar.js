export const NavBarComponent = (pubsub) => {
    let template = `
    <input type="radio" class="btn-check" name="btnradio" value="#TIPO" id="#ID" #CHECKED>
    <label class="btn btn-outline-info btn-lg" for="#ID">#CAT</label>`
    let parentElement;
    let list=[]
    return{
        setParentElement: (pr) => {
            // FUNZIONA CHE DETERMINA DOVE POSIZIONARE LA RENDER
            parentElement = pr;
        },
        setData: (data) => {
            list=data;
        }
        ,render: () => {
            // FUNZIONE CHE INIETTA DENTRO IL CONTAINER IL CSS
            let html = "";
            list.forEach((tip,index) => {
                // GENERA CODICE
                let radioId = "radio" + tip.id;
                if (index === 0) {
                    //PER IL CHECKED [SE è IL PRIMO ALLORA SARà CHECKED]
                    html += template.replace(/#ID/g, radioId).replace("#CAT", tip.name).replace("#TIPO", tip.id) .replace("#CHECKED", "checked");
                } else {
                    html += template.replace(/#ID/g,radioId) .replace("#CAT", tip.name).replace("#TIPO", tip.id).replace("#CHECKED", "");
                }
            });
            parentElement.innerHTML = html;

            document.querySelectorAll(".btn-check").forEach((radio) => {
                radio.onclick = () => {
                    pubsub.publish("Tipo-elemento" , radio.value);
                };
            });

        }
    }
}
