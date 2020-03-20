require("./trans.js");

require("./bootstrap");
require("./animsition.min.js");
require("./script.js");

import LazyLoad from "vanilla-lazyload";
import PlantCalc from "./calc.js";
import React from "react";
import ReactDOM from "react-dom";
import Seedlings from "./components/Seedlings.js";
import Questionnaire from "./components/Questionnaire.js";

var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy",
    load_delay: 300 //adjust according to use case
});

if (document.getElementById("seedlings")) {
    axios.get("/seedlings").then(function(res) {
        ReactDOM.render(
            <Seedlings ss={res.data.data} />,
            document.getElementById("seedlings")
        );
    });
}

if (document.getElementById("plant_calc")) {
    axios.get("/seedlings/calc").then(function(res) {
        var plants_data = {
            plants: res.data.data,
            planting: 7000,
            maint: [
                {
                    qty: 1,
                    values: [
                        { age: 2, val: 2000 },
                        { age: 3, val: 2000 },
                        { age: 4, val: 1000 },
                        { age: 5, val: 1000 },
                        { age: 6, val: 1000 },
                        { age: 7, val: 0 }
                    ]
                }
            ],
            //maintExtraDiscounts:[{qty:1,val:0},{qty:20,val:500},{qty:40,val:1000},{qty:60,val:2000},{qty:80,val:3000}],
            enshurance: 1,
            qtySteps: [1, 10, 20, 40, 60, 80],
            qtyMax: 100,
            currencyScale: 1
        };
        window.plantCalc = new PlantCalc("#plant_calc", plants_data);
    });
}

if (document.getElementById("questionnaire")) {
    ReactDOM.render(
        <Questionnaire />,
        document.getElementById("questionnaire")
    );
}
