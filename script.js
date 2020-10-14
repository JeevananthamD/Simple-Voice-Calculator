
function insertSymbols(html,value, code) {
    html=html.replace("{{value}}", value);
    html=html.replace("{{code}}", code);
    if(value==="") {
        html=html.replace("{{buttons}}", "empty");
    }
    else if(value==".") {
        html=html.replace("{{buttons}}", "number"); 
    }
    else if(isNaN(value)) {
        html=html.replace("{{buttons}}", "operator"); 
    } 
    else {
        html=html.replace("{{buttons}}", "number");
    }
    return html;
}
// START // Preparing the html for buttons
document.addEventListener("DOMContentLoaded", function() {
    let buttonContent=["C", "CE", "%", "&#247", 7, 8, 9, "&times", 4 , 5, 6, "-", 1, 2, 3, "+", "", 0, ".", "="];
    let html="";
    for(let i=0; i<20; i++) {
        let message="<a href='#'><div class='{{buttons}}' id='b{{code}}'>{{value}}</div></a>";
        value=buttonContent[i];
        let code=i;
        message=insertSymbols(message, value, code);
        html+=message;
    }
    document.getElementById("keypad").innerHTML=html;
// End of preparing html for buttons

// Functions for inserting html for calculation
    function gethistory() {
        return document.querySelector("#history").innerHTML;
    }
    function printhistory(num) {
        if(num.length>30) {
            document.querySelector("#input").innerHTML="To Large";
            document.querySelector("#history").innerHTML="";
        }
        else {
            document.querySelector("#history").innerHTML=num;
        }
    }
    function getinput() {
        return document.querySelector("#input").innerHTML;
    }
    function printinput(num) {
        if(num=="") {
            document.querySelector("#input").innerHTML=num;
        }
        else if(num.length>16) {
            document.querySelector("#input").innerHTML="To Large";
        }
        else {
            document.querySelector("#input").innerHTML=formattedNumber(num);
        }
    }
    function formattedNumber(num) { // Adds coma for numbers
        if(num=="-") {
            return "";
        }
        let n= num;
        let value=n.toLocaleString("en");
        return value;
    }
    function normalNumber(num) { // Removes coma from numbers
        return (num=="")?0:num.replace(/,/g, ""); 
    }
// End of functions for inserting html

// Responding to operator click
    let operator=document.getElementsByClassName("operator");
    for(let i=0; i<operator.length; i++) {
        operator[i].addEventListener("click", function() {
            if(this.id=="b0") { // buttonContent="C" Responding to C
                printinput("");
                printhistory("");
            }
            else if(this.id=="b1") { // buttonContent="CE" Responding to CE
                let input=normalNumber(getinput()).toString();
                if(input) {
                    input=input.substr(0, input.length-1);
                    printinput(input);
                }
            }
            else if(this.id=="b19") { // buttonContent="=" Responding to =
                let input=normalNumber(getinput());
                let history=gethistory().toString();
                history=history+input;
                let result=eval(history);
                printinput(result);
                printhistory("");
            }
            else { // Responding to %, /, *,+
                let operation="";
                if(this.id=="b3") { // to convert divition symbol
                    operation="/";
                }
                else if(this.id=="b7") { // to convert multipication symbol
                    operation="*";
                }
                else {
                    operation=this.innerHTML;
                }
                let history=gethistory().toString();
                let input=normalNumber(getinput()).toString();
                if(input==0 && history=="") {
                    printinput("");
                    printhistory("");
                }
                else if(input==0 && history!="") {
                    history=history.substr(0, history.length-1);
                    history+=operation;
                    printhistory(history);
                }
                else {
                    input+=operation;
                    history+=input;
                    printinput("");
                    printhistory(history);
                }
            }
        });
    }
// End responding to operator click

// Responding to number click
    let number=document.getElementsByClassName("number");
    for(let i=0; i<number.length; i++) {
        number[i].addEventListener("click", function() {
            let input=(normalNumber(getinput())==0)?"":normalNumber(getinput());
            input+=this.innerHTML;
            printinput(input);
        });
    }
// End of responding to number click

// Voice recognition
let microphone=document.getElementById("microphone");
microphone.onclick=function() {
    microphone.classList.add("record");
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang="en-IN";
    recognition.start();
    voiceOperations = {"plus":"+",
				 "minus":"-",
				 "multiply":"*",
				 "multiplied":"*",
				 "divide":"/",
				 "divided":"/",
                 "reminder":"%",
                 "remainder":"%"}
    recognition.onresult=function(event) {
        let input=event.results[0][0].transcript;
        console.log(input);
        for(property in voiceOperations) {
            input=input.replace(property, voiceOperations[property]);
        }
        document.getElementById("input").innerHTML=input;
        setTimeout(function() {
            evaluate(input);
        }, 2000);
        microphone.classList.remove("record");
    }
}
function evaluate(input) {
    try {
        let result=eval(input);
        document.getElementById("input").innerHTML=result;
    }
    catch(err) {
        document.getElementById("input").innerHTML="";
        alert("Error");
    }
}
// End of voice recognition

});
// END
