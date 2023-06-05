async function createForm({ targetDiv, formID, array_data, css_class = {}, func = null, btnId }) {
    //if array is empty, targetdiv id not passed
    if (array_data?.length == 0 || !targetDiv || !formID || !btnId) {
        return
    }
    //get the target div
    let currentDiv = document.getElementById(targetDiv);

    //create form
    let form = document.createElement("form");
    form.setAttribute("id", formID)
    if (css_class.hasOwnProperty("form")) {
        form.classList.add(...(css_class["form"]))
    }
    
    //create input element
    //label, type, name, required are required
    for (let i = 0; i < array_data.length; i++) {
        let div = document.createElement("div");
        if (css_class.hasOwnProperty("div")) {
            div.classList.add(...(css_class["div"]))
        }

        let label = document.createElement("label");
        label.innerHTML = array_data[i]?.label;
        div.appendChild(label)

        //if select 
        if (array_data[i]?.type == "select") {
            let select = document.createElement("select")
            if (css_class.hasOwnProperty("select")) {
                select.classList.add(...(css_class["select"]))
            }
            select.name = array_data[i]?.name;
            select.required = array_data[i]?.required;
            //select options
            for (let j = 0; j < array_data[i]?.options?.length; j++) {
                let option = document.createElement("option")
                option.innerHTML = array_data[i].options[j]?.label;
                option.value = array_data[i].options[j]?.value;
                select.appendChild(option)
            }
           
            div.appendChild(select)
            form.appendChild(div)
            continue;
        }

        //inputs
        let input = document.createElement("input");
        input.type = array_data[i]?.type;
        input.name = array_data[i]?.name;
        input.required = array_data[i]?.required;
        if (css_class.hasOwnProperty("input")) {
            input.classList.add(...(css_class["input"]))
        }
        div.appendChild(input);
        form.appendChild(div)
    }
    //submit button
    var submit = document.createElement("button")
    submit.type = "submit";
    submit.innerHTML = "Submit";
    submit.setAttribute("id", btnId)
    if (css_class.hasOwnProperty("button")) {
        submit.classList.add(...(css_class["button"]))
    }
    form.appendChild(submit);

    //event listener and function that runs on submit
    if (func != null) {
        form.addEventListener("submit", func)
    }
    currentDiv.appendChild(form);
    return
}

export default {
    createForm
}