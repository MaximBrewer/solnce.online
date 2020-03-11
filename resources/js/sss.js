require('./trans.js');

require('./bootstrap');
require('./animsition.min.js');
require('./script.js');


import LazyLoad from "vanilla-lazyload";
import React from "react";
import ReactDOM from "react-dom";
import Seedlings from "./components/Seedlings.js";
import Questionnaire from "./components/Questionnaire.js";


var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy",
    load_delay: 300 //adjust according to use case
});


axios.get('/seedlings')
    .then(function (res) {
        ReactDOM.render(
            <Seedlings ss={res.data.data} />,
            document.getElementById('shop')
        );
    })


// ReactDOM.render(
//     <Questionnaire />,
//     document.getElementById('questionnaire')
// );