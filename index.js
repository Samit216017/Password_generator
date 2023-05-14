const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const inputSlider = document.querySelector("[data-lengthSlider]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indecator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;

handleSlider();

//set strength circle color to grey
setIndicator("#ccc");

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min) * 100 / (max - min)) + "% 100%";
}

//set indicator
function setIndicator(color) {
    indecator.style.backgroundColor = color;
    //shadow
    indecator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//generate random integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//generate randon integer (0, 9)
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

//generate random upper case
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

//generate random lower case
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

//generate random symbols
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

//create strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hassym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hassym = true;

    if(hasUpper && hasLower && (hasNum || hassym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hassym) && passwordLength >= 6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

//checkbox change count
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    //special coondition
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

//suffle password
function sufflePassword(shufflePasssword) {
    //Fisher Yates Method
    for(let i=shufflePasssword.length-1; i>=0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shufflePasssword[i];
        shufflePasssword[i] = shufflePasssword[j];
        shufflePasssword[j] = temp;
    }

    let str = "";
    shufflePasssword.forEach( (elements) => {
        str += elements;
    });

    return str;
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount <= 0)
    {
        return;
    }

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the jpurney to find new password

    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes
    /*if(uppercaseCheck.checked)
    {
        password += generateUpperCase();
    }

    if(lowercaseCheck.checked)
    {
        password += generateLowerCase();
    }

    if(numbersCheck.checked)
    {
        password += generateRandomNumber();
    }

    if(symbolsCheck.checked)
    {
        password += generateSymbol();
    }*/

    //other way
    let funcArr = [];

    if(uppercaseCheck.checked)
    {
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked)
    {
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked)
    {
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for(let i=0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++)
    {
        let randIndx = getRndInteger(0, funcArr.length);
        password += funcArr[randIndx]();
    }

    //suffle the password
    password = sufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
})