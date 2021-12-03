/**
 * @author Faezeh Naeimi 
 * @summary action for 'Save your Answer' button
 * @Description save new name with the gende in the localStorage
*/ 
function saveNew(){
    //get the name which is written in the input 
    var name = document.getElementById("input-name").value;
    if(!name){ // check if input is not null
        return openSnackbar("Please enter name!");
    }

    const validName = /^[a-zA-Z\s]*$/.test(name); // a regex for input name : name just contain charachter and space
    if ( !validName ){ // check if name is valid
        return openSnackbar("نام انتخابی فقط می تواند شامل حروف انگلیسی و فاصله باشد.");
    }

    var gender = document.querySelector('input[name="gender"]:checked');
    if( !gender || gender===null){ // check if radio button clicked or not to detect the gender of name
        return openSnackbar('please check the radio button !');
    }

    var genderResult = gender.id === "gender-man" ? "male" : "female"; //get the value of radio button to detect if is man or woman
    document.getElementById('saved-answer').style.display= 'flex' ; // set the display of the division flex to show the result
    document.getElementById('saved-before').style.display= 'none' ; // set the display of the division none because it is not saved befor to hid the div
    document.getElementById("saved-answer-gender").textContent = genderResult; // show the result in the html element
    setTimeout(function() { // timeout for saving the info in html element before show the message
        return openSnackbar("saved :)");
    },20)

    return localStorage.setItem(name, genderResult ); // save result in local sotrage
}


/**
 * @summary action for 'Save result' button
 * @description save result of prediction in localStorage
*/ 
function saveResult(){
    var gender = localStorage.getItem("lastPredict") ;  //'last predict' item save in the localStorage before whith the result of prediction
    localStorage.setItem(localStorage.getItem("lastName"), gender);
    document.getElementById('saved-answer').style.display= 'flex' ;  //make the saved-answer div visible
    document.getElementById("saved-answer-gender").textContent = gender;  //set the related div value
    setTimeout(function() {  // timeout for updating html elements before show the message
        return openSnackbar("saved :)");
    },20)
}


/**
 * @summary action for 'clear' button
 * @description clear the name and related gender from localStorage
*/ 
function clearResult(){
    localStorage.removeItem(`${localStorage.getItem("lastName")}`); // remove 'lastName' info from localStorage. lastName is last name which was predicted by server in website.
    document.getElementById('saved-answer').style.display= 'none' ;  // make the related div unvisible
    document.getElementById("saved-answer-gender").textContent = "" ;  //clear related div value
    setTimeout(function() { // timeout for updating html elements before show the message
        return openSnackbar("removed :)");
    },20)
}


/**
 * @summary action for 'Predict' button
 * @description send request to the server and get the result. show the prediction of server and if the name was already in the localStorage show the related div too.
*/
function getName(){
    var name = document.getElementById("input-name").value; // get the entered name in input
    
    if(!name){ // check if the input was not empty
        return openSnackbar("Please enter name!");
    }

    const validName = /^[a-zA-Z\s]*$/.test(name); // a regex for input name : name just contain charachter and space
    if ( !validName ){ // check if name is valid
        return openSnackbar("Name just contain charachter and apace!");
    }

    localStorage.setItem("lastName", name); // save name in localStorage
    var url = `https://api.genderize.io/?name=${name}`; // the url of server to send request for prediction

    fetch(url).then(response => response.json()) // send request
        .then(data => {
            if(data.gender === null){ // check if the name had not been predicted
                document.getElementById("prediction-result").textContent= ""; //make prediction result element empty
                setTimeout(function() { // timeout for updating html elements before show the message
                    openSnackbar("Oops! We can not predict :(");
                },10)
            }
            else{ // if the name had been predicted in server
                document.getElementById("prediction-result").textContent= `${data.gender}  ${data.probability}`; // set the result in html elemnts
                document.getElementById('prediction').style.display= 'flex' ; //make related div visible
                localStorage.setItem("lastPredict", data.gender); // set data in localStorage
            }
    })
    .catch( err =>{ // if error happend in sending request write in console 
        openSnackbar("Oops! something wrong happened :`(");
        return console.log(err);
    }); 


    if( localStorage.getItem(localStorage.getItem("lastName")) === null){ // check if the name is not predicted befor
        document.getElementById('saved-answer').style.display= 'none' ; // make befor-saved answer unvisible
        document.getElementById('saved-before').style.display= 'none' ; // make befor-saved element unvisible
        return document.getElementById("saved-answer-gender").textContent = "" ; // make related element value empty
    }
   
    // if the name is predicted before and we save that in localStorage
    document.getElementById('saved-answer').style.display= 'flex' ; //make related div visible
    document.getElementById('saved-before').style.display= 'flex' ; //make related div visible
    return document.getElementById("saved-answer-gender").textContent = localStorage.getItem(localStorage.getItem("lastName")) ; //set the input of related element

}

function openSnackbar( msg ){
    var snackbar = document.getElementById("snackbar"); //get element of snackbar
    snackbar.textContent= msg;
    snackbar.className = "show"; //replace class name 
    setTimeout(function(){ snkbr.className = snkbr.className.replace("show", ""); }, 5000); //set duration for showing time
}