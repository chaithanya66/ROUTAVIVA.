// Export user id
let user_id_export = localStorage.getItem("user_id");
console.log(user_id_export);

let globalStartTripId = null;
let globalEndTripId = null;

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

let placesarray = [];
let currentInput = null;

function display(resultplace) {
    const resultbox = document.querySelector(".resultbox");
    resultbox.innerHTML = "<ul>" + 
        resultplace.map(place => `<li data-id="${place.id}">${place.mainText}</li>`).join('') + 
        "</ul>";

    const allListItems = resultbox.querySelectorAll("li");
    /***
    allListItems.forEach(item => {
        item.addEventListener("click", () => {
            selectInput(item.innerText); 

            const tripId = item.getAttribute("data-id");
            storetripId(tripId);
            console.log(tripId);
        });
    });
    ***/
    allListItems.forEach(item => {
        item.addEventListener("click", () => {
            selectInput(item.innerText);
    
            const tripId = item.getAttribute("data-id");
            storetripId(tripId, currentInput.id);  // Pass the input field ID
            console.log(tripId);
        });
    });    
}

// Function to select input value
function selectInput(selectedText) {
    if (currentInput) {
        currentInput.value = selectedText;
    }
    const resultbox = document.querySelector(".resultbox");
    resultbox.innerHTML = '';
}

async function fetchplaces(store) {
    try {
        const response = await fetch("https://rutavivaunsecured-1.onrender.com/maps/searchPlace", {
            method: "POST",
            headers: {
                uid: "fd00179a-de47-476a-b839-2b1364c4ed0d",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ place: store })
        });

        const data = await response.json();
        let placearrayid = data.data.places;
        console.log("Places fetched: ", placearrayid);

        placesarray = placearrayid;
        console.log("Places array: ", placesarray);

    } catch (error) {
        console.error(error);
    }
}
/***
function storetripId(tripId) {
    localStorage.setItem('selectedTripId', tripId);
    console.log("Trip ID saved to localStorage:", tripId);
}
***/
function storetripId(tripId, inputId) {
    if (inputId === "input-101") {
        localStorage.setItem('startTripId', tripId);
        globalStartTripId = tripId;  // Also store globally
        console.log("Start Trip ID saved to localStorage and global variable:", tripId);
    } else if (inputId === "input-10") {
        localStorage.setItem('endTripId', tripId);
        globalEndTripId = tripId;    // Also store globally
        console.log("End Trip ID saved to localStorage and global variable:", tripId);
    }
}


// Handle input function
async function handleinput(event) {
    const store = event.target.value.trim();
    console.log("Input: ", store);
    currentInput = event.target;
    const resultbox = document.querySelector(".resultbox");
    if (!store.length) {
        resultbox.innerHTML = '';
        return;
    }
    await fetchplaces(store);
    const resultplace = placesarray;
    display(resultplace);
    
}

let startTripId = localStorage.getItem('startTripId');
let endTripId = localStorage.getItem('endTripId');
console.log("start trip id: ",startTripId, "end tripId",endTripId);


// Main function for homepage initialization
function initializeHomepageFunctions() {
    //if (!window.location.pathname.includes("homepage.html")) return;

    const textfieldStart = document.getElementById("input-101");
    const textfieldEnd = document.getElementById("input-10");
    const startButton = document.getElementById("button-start");
    const dateButton = document.getElementById("button");
    const enrouteButton = document.getElementById("button_02");
    const popupButton = document.getElementById("showpopup");
    const popupClose = document.getElementById("toggleit");
    const enroutePopupButton = document.getElementById("enroutepop");
    const enroutePopupClose = document.getElementById("toggleit1");
    const postDetailsButton = document.getElementById("enroute-butt");

    const submitCollaborators = document.getElementById("button-01");
    const mailInput = document.getElementById("mailid-01");
    const collaboratorsShow = document.getElementById("textfeild");
    let collaboratorsList = [];
    let collaboratorCount = 0;

    const submitEnrouteStops = document.getElementById("button-011");
    const textInput = document.getElementById("text-1");
    const enrouteShow = document.getElementById("textfeild1");
    let enrouteList = [];
    let enrouteCount = 0;

    //debounce call
    if (textfieldStart && textfieldEnd) {
        textfieldStart.addEventListener("input", debounce(handleinput, 100));
        textfieldEnd.addEventListener("input", debounce(handleinput, 100));
    }

    startButton.addEventListener('click', function () {
        if (textfieldStart.value !== "" && textfieldEnd.value !== "") {
            document.getElementsByClassName("cont")[0].style.display = "inline-block";
            startButton.style.display = "none";
        }
        console.log(textfieldStart.value, textfieldEnd.value);
    });

    dateButton.addEventListener('click', function () {
        let dateFieldStart = document.getElementById("input-11");
        let dateFieldEnd = document.getElementById("input-12");

        console.log(dateFieldStart.value, dateFieldEnd.value);

        if (dateFieldStart.value === "") {
            console.log("Enter the Start date to proceed");
        }
        if (dateFieldEnd.value === "") {
            console.log("Enter the End date to proceed");
        }
        if (textfieldStart.value !== "" && dateFieldStart.value !== "" && dateFieldEnd.value !== "") {
            dateButton.style.display = "none";
            document.getElementsByClassName("cont-2")[0].style.display = "inline-block";
        }
    });

    enrouteButton.addEventListener('click', function () {
        enrouteButton.style.display = "none";
        document.getElementsByClassName("enroute")[0].style.display = "inline-block";
    });

    // Collaborators popup
    popupButton.addEventListener('click', function () {
        document.getElementById("popup").style.display = "block";
        document.getElementById("maintag").style.display = "none";
        document.getElementById("body").style.backgroundColor = "grey";
    });

    submitCollaborators.addEventListener('click', function () {
        const collaborator = mailInput.value;
        if (collaborator.trim() !== "") {
            collaboratorsList.push(collaborator);
            const newText = document.createElement("div");
            newText.textContent = collaborator;
            newText.style.cssText = `
                color: white;
                margin-bottom: 10px;
                font-size: 15px;
                border-radius: 10px;
                background-color: hsla(0, 0%, 0%, 0.6);
                height: 20px;
                margin-right: 10px;
                padding: 15px;
                display: inline-block;
                text-align: center;
            `;
            collaboratorsShow.appendChild(newText);

            mailInput.value = "";
            collaboratorCount++;
            popupButton.innerHTML = `You are traveling with ${collaboratorCount} co-passengers`;
        }
    });

    popupClose.addEventListener('click', function () {
        document.getElementById("popup").style.display = "none";
        document.getElementById("maintag").style.display = "block";
        document.getElementById("body").style.backgroundColor = "white";
    });

    // Enroute popup
    enroutePopupButton.addEventListener('click', function () {
        document.getElementById("popup-2").style.display = "block";
        document.getElementById("maintag").style.display = "none";
        document.getElementById("body").style.backgroundColor = "grey";
    });

    submitEnrouteStops.addEventListener('click', function () {
        const enrouteStop = textInput.value;
        if (enrouteStop.trim() !== "") {
            enrouteList.push(enrouteStop);
            const newText = document.createElement("div");
            newText.textContent = enrouteStop;
            newText.style.cssText = `
                color: white;
                margin-bottom: 10px;
                font-size: 15px;
                border-radius: 10px;
                background-color: hsla(0, 0%, 0%, 0.6);
                height: 20px;
                margin-right: 10px;
                padding: 15px;
                display: inline-block;
                text-align: center;
            `;
            enrouteShow.appendChild(newText);

            textInput.value = "";
            enrouteCount++;
            enroutePopupButton.innerHTML = `You are interested in ${enrouteCount} enroute stops`;
        }
    });

    enroutePopupClose.addEventListener('click', function () {
        document.getElementById("popup-2").style.display = "none";
        document.getElementById("maintag").style.display = "block";
        document.getElementById("body").style.backgroundColor = "white";
    });

    // Post trip details
    postDetailsButton.addEventListener('click', async function () {
        try {
            const response = await fetch('https://rutavivaunsecured-1.onrender.com/trip', {
                method: 'POST',
                headers: {
                    'uid': user_id_export,
                    'Content-Type': 'application/json',
                    'X-API-Key': ''
                },
                body: JSON.stringify({
                    tripName: textfieldEnd.value,
                    fromDestination: globalStartTripId,
                    toDestination: globalEndTripId,
                    fromDate: document.getElementById("input-11").value,
                    toDate: document.getElementById("input-12").value,
                    enRouteStops: enrouteList,
                    collaborators: collaboratorsList
                })
            });
            console.log("After trip creation: ", response);
            if (response.status === 200) {
                window.location.href = "../dashboard/dashboard.html";
            }
        } catch (error) {
            console.error(error);
        }
    });
}

initializeHomepageFunctions();
