import {post} from "../../api/http-client.js";
import {login_url}from "../../constants/constants.js"

const form = document.querySelector('#form');
const email = document.querySelector('#email-input');
const password = document.querySelector('#password-input');

function validateInputs() {
    const emailval = email.value.trim();
    const passwordval = password.value.trim();

    if (emailval === '') {
        setError(email, 'Email is required');
    } else if (!validateEmail(emailval)) {
        setError(email, 'Please enter a valid email');
    } else {
        setSuccess(email);
    }
    if (passwordval === '') {
        setError(password, 'Password is required');
    } else if (passwordval.length < 5) {
        setError(password, 'Password must be at least 8 characters');
    } else {
        setSuccess(password);
    }
    return true;
}

function validateGenericInput(fieldValue,field,message){
    if (fieldValue === '') {
        setError(field, message);
        return false;
    } else {
        setSuccess(field);
        return true;
    }
}

function setError(element, message) {
    const inputype = element.parentElement;
    const errorElement = inputype.querySelector('.error');

    errorElement.innerText = message;
    inputype.classList.add('error');
    inputype.classList.remove('success');
}

function setSuccess(element) {
    const inputype = element.parentElement;
    const errorElement = inputype.querySelector('.error');

    errorElement.innerText = '';
    inputype.classList.add('success');
    inputype.classList.remove('error');
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.getElementById('button-input'); 
    button.classList.add('loading');
    button.disabled = true;

    if (validateInputs()) { 
        await registerUser();
    } 
});


export async function registerUser() {
    console.log("Inside register user");

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
        alert("All fields are required.");
        return;
    }
    const body = {
        email: emailValue,
        password: passwordValue,
    };

    console.log("Body is " + JSON.stringify(body));

    const button = document.getElementById('button-input');
    button.classList.add('loading');
    button.disabled = true;
    try {
        const response = await post(login_url, body);
        console.log("Response is ", response)
        if (response.code === 200) {
            console.log("Registration successful:", response);

            const user_id=response["data"]["user_id"];
            console.log(user_id);
            let value=user_id;
            localStorage.setItem("user_id",user_id);
            let stored_user=localStorage.getItem("user_id");
            console.log(stored_user);

            window.location.href = '../homepage/homepage.html';
        }
        else if(response && response.code === 400){
            document.getElementById("textcontenterror").textContent='Password is incorrect';
        }
         else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            alert("Registration failed. Please check your inputs or try again later.");
        }
    } catch (error) {
        console.error("Registration failed: ", error.message || error);
        alert("An error occurred. Please try again later.");
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
    }
}