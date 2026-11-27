import english from "./assets/english.json";
const typingMain = document.getElementById("typing-main");
const cursor = document.getElementById("cursor");
const wordinput = document.getElementById("type");
const words = document.getElementById("words");
const engwords = english.words;
let wordsOffset = 0;
let Imgindex = 0;
let wordlength = 100;
let activeMode = document.querySelector("#modes .active").id;
let activeModeValue = document
    .querySelector("#modeNumbers .active")
    .textContent.trim();
const modeNumbers = document.getElementById("modeNumbers");
const modes = document.querySelectorAll("#modes >span");
const modediv = document.getElementById("modes");
const nav = document.querySelector("nav");

function modeValue() {
    const numberSpans = document.querySelectorAll("#modeNumbers > span");
    numberSpans.forEach((span) => {
        span.addEventListener("click", () => {
            numberSpans.forEach((s) => s.classList.remove("active"));
            span.classList.add("active");
            activeModeValue = span.textContent.trim();
            processingWords();
            wordinput.focus();
        });
    });
}

function modeChanger() {
    modes.forEach((mod) => {
        mod.addEventListener("click", () => {
            modes.forEach((m) => m.classList.remove("active"));
            mod.classList.add("active");
            activeMode = mod.id;
            if (activeMode == "timemode") {
                modeNumbers.innerHTML = `
					<span class="active">15</span>
					<span>30</span>
					<span>60</span>
					<span>120</span>

        `;
            } else if (activeMode == "wordmode") {
                modeNumbers.innerHTML = `
					<span class="active">10</span>
					<span>25</span>
					<span>50</span>
					<span>100</span>
        `;
            } else if (activeMode == "quotemode") {
                modeNumbers.innerHTML = `

					<span class="active">all</span>
					<span>meme</span>
					<span>short</span>
					<span>long</span>
        `;
            }
            activeModeValue = document
                .querySelector("#modeNumbers .active")
                .textContent.trim();
            // This reloads and changes the value of the modeNumbers after selecting mode
            modeValue();
            processingWords();
            wordinput.focus();
        });
    });
    // This make sures that page is listening when clicking directly on time as default
    modeValue();
}
function textareaMove() {
    const currentWord = document.querySelector(".word.current");
    const rect = currentWord.getBoundingClientRect();
    wordinput.style.width = rect.width + "px";
    wordinput.style.height = rect.height + "px";
    wordinput.style.top = rect.top + "px";
    wordinput.style.left = rect.left + "px";
}

function moveCursor() {
    const nextLetter = document.querySelector(".letter.current");
    const wordEnd = document.querySelector(".word.current");
    const newposition = (nextLetter || wordEnd).getBoundingClientRect();
    cursor.style.top =
        newposition.top +
        newposition.height / 2 -
        cursor.offsetHeight / 2 +
        "px";
    cursor.style.left =
        newposition[nextLetter ? "left" : "right"] -
        cursor.offsetWidth / 2 +
        "px";
}

function moveWindow() {
    const currentWord = document.querySelector(".word.current");
    if (!currentWord) return;

    const lineHeight = parseFloat(getComputedStyle(currentWord).lineHeight);

    // Target position: second line
    const targetPosition = lineHeight;

    // Original layout position (not affected by transform)
    const wordPosition = currentWord.offsetTop;

    // Never move the original first line down into the middle.
    const newOffset = Math.min(0, targetPosition - wordPosition);

    wordsOffset = newOffset;

    words.style.transform = `translateY(${wordsOffset}px)`;

    requestAnimationFrame(moveCursor);
    textareaMove();
}
function timer(activemodeValue) {
    const info = document.getElementById("info");
    const timer = document.createElement("span");
    let timeLeft = activemodeValue;
    timer.classList.add("timer");
    info.appendChild(timer);
    setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        if (timeLeft <= 0) {
            console.log("timer worked as planned");
        }
    }, 1000);
}

function addClass(el, classname) {
    el.classList.add(classname);
}

function removeClass(el, classname) {
    el.classList.remove(classname);
}

function randWords(wordlength) {
    const unindexedWord = [];
    for (let i = 0; i < wordlength; i++) {
        const randIndex = Math.floor(Math.random() * engwords.length);
        unindexedWord.push(engwords[randIndex]);
    }

    words.innerHTML = unindexedWord
        .map((word, index) => {
            return `<div class="word" data-ui-state="untyped" data-wordindex="${index + 1}"  >${word}</div>`;
        })
        .join("");
    document.querySelectorAll(".word").forEach((div) => {
        div.innerHTML = div.textContent
            .split("")
            .map((letters, index) => {
                return `<span class="letter" data-letterindex="${index + 1}" data-ui-state="untyped"data-char="${letters}">${letters}</span>`;
            })
            .join("");
    });
}
function imgtoggle() {
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back${Imgindex}.jpg')`;
    Imgindex = (Imgindex % 6) + 1;
}

async function processingWords() {
    if (activeMode == "timemode") {
        wordlength = Math.ceil(Number(activeModeValue) * 3.5);
    } else if (activeMode == "wordmode") {
        wordlength = Number(activeModeValue);
    }
    randWords(wordlength);
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    typingMain.focus();
    // Don't touch this first calculates font to place cursor in it's place
    await document.fonts.ready;
    //==========================================
    requestAnimationFrame(moveCursor);
    textareaMove();
}
function typemode(toggle) {
    if (activeMode == "timemode") {
    } else if ((activeMode = "wordmode")) {
        console.log("working");
    }
    modeNumbers.style.opacity = (+!toggle).toString();
    cursor;
    nav.style.opacity = (+!toggle).toString();
    cursor.style.animation = "none";
    modediv.style.opacity = (+!toggle).toString();
}
function extraIncorrectLetter(key) {
    const currentWord = document.querySelector(".word.current");
    const extraLetter = document.createElement("span");
    extraLetter.textContent = key;
    extraLetter.classList.add("extra", "letter");
    currentWord.appendChild(extraLetter);
}
function typingcheck() {
    wordinput.focus();
    wordinput.addEventListener("keydown", (ev) => {
        const isTab = ev.key === "Tab";
        if (isTab) {
            ev.preventDefault();
            typemode(false);
            processingWords();
            wordinput.focus();
        }
    });
    wordinput.addEventListener("beforeinput", (ev) => {
        ev.preventDefault();
        const key = ev.data;
        const currentLetter = document.querySelector(".letter.current");
        const currentWord = document.querySelector(".word.current");
        const wordswrapper = document.getElementById("words");
        const wrongWordCounts = currentWord.querySelectorAll(":scope>.extra");
        const expected = currentLetter?.getAttribute("data-char") || " ";
        if (ev.inputType === "insertText") {
            if (currentLetter && currentWord) {
                if (
                    currentWord.firstElementChild === currentLetter &&
                    key === " "
                ) {
                    return;
                }
                if (
                    currentLetter !== currentWord.firstElementChild &&
                    key === " " &&
                    currentWord !== wordswrapper.lastElementChild
                ) {
                    const nextWord = currentWord.nextElementSibling;
                    const nextLetter = nextWord.firstElementChild;
                    addClass(nextLetter, "current");
                    addClass(nextWord, "current");
                    addClass(currentWord, "wrongUnderline");
                    addClass(currentWord, "typedIncorrectly");
                    removeClass(currentWord, "current");
                    removeClass(currentLetter, "current");
                } else {
                    typemode(true);
                    if (key == expected) {
                        addClass(currentLetter, "correct");
                        currentLetter.dataset.uiState = "correct";
                    } else {
                        addClass(currentLetter, "incorrect");
                        currentLetter.dataset.uiState = "incorrect";
                    }
                    removeClass(currentLetter, "current");

                    if (currentLetter.nextElementSibling) {
                        addClass(currentLetter.nextElementSibling, "current");
                    }
                }
            } else if (
                !currentLetter &&
                currentWord !== wordswrapper.lastElementChild
            ) {
                if (key === expected) {
                    removeClass(currentWord, "current");
                    addClass(
                        currentWord.nextElementSibling.firstElementChild,
                        "current",
                    );
                    addClass(currentWord.nextElementSibling, "current");
                } else if (key !== expected && wrongWordCounts.length < 22) {
                    extraIncorrectLetter(key);
                }
            }
        } else if (ev.inputType === "deleteContentBackward") {
            // This if block is for inside a word it moves one word backward
            if (currentLetter && currentWord) {
                if (currentLetter !== currentWord.firstChild) {
                    removeClass(currentLetter, "current");

                    const previousLetter = currentLetter.previousElementSibling;

                    addClass(previousLetter, "current");
                    removeClass(previousLetter, "correct");
                    removeClass(previousLetter, "incorrect");
                } else if (currentWord.previousElementSibling) {
                    // This code blocks moves cursor and position to the last chracter of the previous word
                    // From first if code block it confirms that this is the firstletter of element word
                    removeClass(currentLetter, "current");
                    removeClass(currentWord, "current");

                    const previousWord = currentWord.previousElementSibling;
                    addClass(previousWord, "current");
                    if (previousWord.classList.contains("wrongUnderline")) {
                        removeClass(previousWord, "wrongUnderline");
                    }
                }
            } else if (!currentLetter && currentWord) {
                // this is to check if we are at the end of a word ( space position)
                const lastLetter = currentWord.lastElementChild;
                if (lastLetter.classList.contains("extra")) {
                    lastLetter.remove();
                }
                addClass(lastLetter, "current");
                removeClass(lastLetter, "correct");
                removeClass(lastLetter, "incorrect");
            }
        } else if (ev.inputType === "deleteWordBackward") {
            if (currentLetter && currentWord) {
                if (currentLetter !== currentWord.firstChild) {
                    // This code blocks loops through currentLetter to firstchildSibling
                    const finalWord = currentWord.firstElementChild;
                    let currentEl = currentLetter;
                    while (currentEl) {
                        removeClass(currentEl, "correct");
                        removeClass(currentEl, "incorrect");
                        currentEl = currentEl.previousElementSibling;
                    }
                    addClass(finalWord, "current");
                    removeClass(currentLetter, "current");
                } else if (currentWord.previousElementSibling) {
                    // This function triggers if the cursor is at the front of the word that is current letter is first element of the current word then it triggers on Ctrl-Backspace
                    // This code blocks moves cursor and position to the first character of the previousWord (IT is buggy and stops working sometimes)
                    const previousWord = currentWord.previousElementSibling;
                    const previousLetter = previousWord.firstElementChild;
                    addClass(previousLetter, "current");
                    addClass(previousWord, "current");
                    removeClass(currentWord, "current");
                    removeClass(currentLetter, "current");
                    const rmPreviousLetters =
                        previousWord.querySelectorAll(":scope>.letter");
                    rmPreviousLetters.forEach((letter) => {
                        letter.classList.remove("correct", "incorrect");
                    });
                    if (previousWord.classList.contains("wrongUnderline")) {
                        removeClass(previousWord, "wrongUnderline");
                    }
                    // This is to calculate extra letters input instead of expected space
                    const wrongWordCounts =
                        previousWord.querySelectorAll(":scope>.extra");
                    if (wrongWordCounts) {
                        wrongWordCounts.forEach((word) => {
                            word.remove();
                        });
                    }
                }
            } else if (!currentLetter && currentWord) {
                // It takes care of Ctrl-Backspace when the cursor(or current word has no current letter left that is it si in the last of the word)
                // It jumps in front of the  current word  from the last when pressed  ctrl backspace

                const rmWrongLetters =
                    currentWord.querySelectorAll(":scope>.letter");
                rmWrongLetters.forEach((letter) => {
                    letter.classList.remove("correct", "incorrect");
                });
                // This is to calculate extra letters input instead of expected space
                if (wrongWordCounts) {
                    wrongWordCounts.forEach((word) => {
                        word.remove();
                    });
                }
                const finalWord = currentWord.firstElementChild;
                addClass(finalWord, "current");
            }
        }
        moveWindow();
    });
}

async function main() {
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back5.jpg')`; // Sets Background Image
    document.getElementById("imgtoggle").addEventListener("click", imgtoggle); // Makes the image button active
    processingWords();
    moveWindow();
    modeChanger(); // It runs event listener for modes
    typingMain.addEventListener("click", () => {
        wordinput.focus();
    });
    typingcheck();

    document.getElementById("title").addEventListener("click", () => {
        processingWords();
    });
}

main();
