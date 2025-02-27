const tabella = document.getElementById("tabella");
const precendente = document.getElementById("precedente");
const successiva = document.getElementById("successiva");
const navbar = document.getElementById("navbar");
const formElement = document.getElementById("form");

import {tableComponent} from './componenti/table.js';
import {NavBarComponent} from './componenti/navbar.js';
import {createForm} from './componenti/form.js';
import {createMiddleware} from './componenti/middleware.js';
import {generatePubSub} from "./componenti/pubsub.js";


let starDay = 0;
fetch("conf.json").then(r => r.json()).then(conf => {
    const pubsub = generatePubSub()
    const form = createForm(formElement, pubsub);
    const table1 = tableComponent();
    const navBarComp = NavBarComponent(pubsub);
    const middleware = createMiddleware();
    navBarComp.setParentElement(navbar);

    pubsub.subscribe("carica-dati-list", (data) => {
        console.log(data)
        navBarComp.setData(data.list);
        navBarComp.render();
        form.setLabels(data.result);
        table1.setData(data.result);
        table1.setParentElement(tabella);
        table1.render(starDay)
        navBarComp.render(form,table1);
        console.log("Dati caricati sulla lista");
    });

    pubsub.subscribe("set-dati", (data) => {
        middleware.add(data).then(
        middleware.load().then(r =>{         
            form.setLabels(r);
            table1.setData(r);
            table1.render();
            console.log("set Dati sulla lista");
            console.log(r)
        }
        )
    )
    });

    pubsub.subscribe("Tipo-elemento", (data) =>{
        form.setType(data)
        table1.setTipo(data);
        table1.render()
    })

    pubsub.subscribe("InsertData", async (diz) => {
        console.log(diz);
        await middleware.add(diz).then(
            middleware.load().then(r =>{         
                form.setLabels(r);
                table1.setData(r);
                table1.render();
                console.log("set Dati sulla lista");
                console.log(r)
            })
        )

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

    form.render(table1,middleware)
    /*setInterval(()=>{
        compFetch.getData().then(data => {
            form.setLabels(data);
            table1.setData(data); // Imposta i dati nel componente tabella
            table1.render(starDay);// Renderizza la tabella con i dati recuperati
            
        });
    },300000)*/

      middleware.load().then(
        r => pubsub.publish("carica-dati-list", r)        
    );
});