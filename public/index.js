const tabella = document.getElementById("tabella");
const precendente = document.getElementById("precedente");
const successiva = document.getElementById("successiva");
let starDay = 0;
const navbar = document.getElementById("navbar");
const formElement = document.getElementById("form");

import {tableComponent} from './componenti/table.js';
import {NavBarComponent} from './componenti/navbar.js';
import {createForm} from './componenti/form.js';
import {generateFetchComponent} from './componenti/fetch_component.js';
import { generatePubSub } from './componenti/pubsub.js';
import { createMiddleware } from './componenti/middleware.js';//


fetch("conf.json").then(r => r.json()).then(conf => {
    const pubsub = generatePubSub()
    const form = createForm(formElement, pubsub);
    const table1 = tableComponent();
    const navBarComp = NavBarComponent(conf);
    const compFetch = generateFetchComponent()
    compFetch.caricaDati(conf)
    compFetch.getData().then(data => {
        form.setLabels(data);
        table1.setData(data); // Imposta i dati nel componente tabella
        table1.setParentElement(tabella);
        table1.render(starDay);// Renderizza la tabella con i dati recuperati
    });
    precendente.onclick = () => {
        starDay -= 7;
        table1.start(starDay)
        table1.render();
    }

    successiva.onclick = () => {
        starDay += 7;
        table1.start(starDay)
        table1.render();
    }
    navBarComp.setParentElement(navbar);
    navBarComp.render(form,table1);
    form.render(table1,compFetch)
    setInterval(()=>{
        compFetch.getData().then(data => {
            form.setLabels(data);
            table1.setData(data); // Imposta i dati nel componente tabella
            table1.render(starDay);// Renderizza la tabella con i dati recuperati
            
        });
    },300000)
});

//iscrivo all evento//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const middleware = createMiddleware();
pubsub.subscribe("InsertData", async (diz) => {
    console.log(diz);
    await middleware.add(diz)
  });