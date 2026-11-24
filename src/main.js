import english from "./assets/english.json";

const typingMain = document.getElementById("typing-main");
const words = document.getElementById("words");
const engwords = english.words;
let wordsOffset = 0;
let previousTop = null;
let Imgindex = 0;
let wordlength = 100;
let activeMode = "timemode";
const modeNumbers = document.getElementById("modeNumbers");
const modes = document.querySelectorAll("#modes >span");
const timer = document.getElementById("timer");
const modediv = document.getElementById("modes");
const nav = document.querySelector("nav");

function modeValue() {
    const modeSpans = document.querySelectorAll("#modeNumbers > span");
    modeSpans.forEach((mode) => {
        mode.addEventListener("click", () => {
            console.log("Active Mode", activeMode);
            console.log("Selected Value", mode.textContent);
            if (activeMode == "timemode") {
                timer.textContent = mode.textContent;
            } else if (activeMode == "wordmode") {
                wordlength = mode.textContent;
                processingWords();
            }
            typingMain.focus();
        });
    });
}

function modeChanger() {
    modes.forEach((mod) => {
        mod.addEventListener("click", () => {
            activeMode = mod.textContent + "mode";
            if (activeMode == "timemode") {
                modeNumbers.innerHTML = `
					<span>15</span>
					<span>30</span>
					<span>60</span>
					<span>120</span>

        `;
            } else if (activeMode == "wordmode") {
                modeNumbers.innerHTML = `
					<span>10</span>
					<span>25</span>
					<span>50</span>
					<span>100</span>
        `;
            } else if (activeMode == "quotemode") {
                modeNumbers.innerHTML = `

					<span>all</span>
					<span>meme</span>
					<span>short</span>
					<span>long</span>
        `;
            }
            // This reloads and changes the value of the modeNumbers after selecting mode
            modeValue();
            typingMain.focus();
        });
    });
    // This make sures that page is listening when clicking directly on time as default
    modeValue();
}

function moveCursor() {
    const nextLetter = document.querySelector(".letter.current");
    const wordEnd = document.querySelector(".word.current");
    const cursor = document.getElementById("cursor");
    const newposition = (nextLetter || wordEnd).getBoundingClientRect();
    cursor.style.top = newposition.top + 2 + "px";
    cursor.style.left = newposition[nextLetter ? "left" : "right"] + "px";
}

function moveWindow() {
    const current =
        document.querySelector(".letter.current") ||
        document.querySelector(".word.current");
    if (!current) return;
    const typingMainRect = typingMain.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    const currentTop = current.getBoundingClientRect().top;
    const lineHeight = parseFloat(getComputedStyle(current).lineHeight);
    console.log(currentTop);
    const center =
        typingMainRect.top + (typingMainRect.height - lineHeight) / 2;
    console.log(wordsOffset);
    if (
        previousTop !== null &&
        currentTop > previousTop &&
        currentTop > center
    ) {
        const difference = center - currentRect.top;
        wordsOffset += difference;
        words.style.transform = `translateY(${wordsOffset}px)`;
        moveCursor();
    }

    previousTop = currentTop;
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
            return `<div class="word" data-wordindex="${index + 1}">${word}</div>`;
        })
        .join(" ");
}
function imgtoggle() {
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back${Imgindex}.jpg')`;
    Imgindex = (Imgindex % 6) + 1;
}

async function processingWords() {
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    typingMain.focus();
    // Don't touch this first calculates font to place cursor in it's place
    await document.fonts.ready;
    typemode(false);
    //==========================================
    requestAnimationFrame(moveCursor);
}
function typemode(toggle) {
    if (activeMode == "timemode") {
        timer.style.opacity = (+toggle).toString();
    }
    modeNumbers.style.opacity = (+!toggle).toString();
    nav.style.opacity = (+!toggle).toString();
    modediv.style.opacity = (+!toggle).toString();
}
function typingcheck() {
    typingMain.addEventListener("keydown", (ev) => {
        typemode(true);
        const key = ev.key;
        const currentLetter = document.querySelector(".letter.current");
        const expected = currentLetter?.innerHTML || " ";
        const currentWord = document.querySelector(".word.current");
        const isLetter = key.length === 1 && key !== " ";
        const isSpace = key === " ";
        const isTab = key === "Tab";
        const isBackspace = key === "Backspace";
        console.log({ key, expected });
        if (isTab) {
            ev.preventDefault();
            processingWords();
        }
        if (isLetter) {
            if (currentLetter) {
                addClass(
                    currentLetter,
                    key === expected ? "correct" : "incorrect",
                );
                removeClass(currentLetter, "current");
                if (currentLetter.nextSibling) {
                    addClass(currentLetter.nextSibling, "current");
                }
            } else {
                const incorrectLetter = document.createElement("span");
                incorrectLetter.innerHTML = key;
                incorrectLetter.className = "letter incorrect extra ";
                currentWord.appendChild(incorrectLetter);
            }
        }
        if (isSpace) {
            if (expected !== " ") {
                const lettersInvalidate = [
                    ...document.querySelectorAll(
                        ".word.current .letter:not(.correct)",
                    ),
                ];
                lettersInvalidate.forEach((letter) => {
                    addClass(letter, "incorrect");
                });
            }
            removeClass(currentWord, "current");
            addClass(currentWord.nextSibling, "current");
            if (currentLetter) {
                removeClass(currentLetter, "current");
            }
            addClass(currentWord.nextSibling.firstChild, "current");
        }

        if (isBackspace) {
            // making last word current
            if (currentLetter && currentWord.firstChild == currentLetter) {
                removeClass(currentWord, "current");
                addClass(currentWord.previousSibling, "current");
                removeClass(currentLetter, "current");
                addClass(currentWord.previousSibling.lastChild, "current");
                removeClass(currentWord.previousSibling.lastChild, "incorrect");
                removeClass(currentWord.previousSibling.lastChild, "correct");
            }
            if (currentLetter && currentWord.firstChild != currentLetter) {
                removeClass(currentLetter, "current");
                addClass(currentLetter.previousSibling, "current");
                removeClass(currentLetter.previousSibling, "correct");
                removeClass(currentLetter.previousSibling, "incorrect");
            }
            if (!currentLetter) {
                addClass(currentWord.lastChild, "current");
                removeClass(currentWord.lastChild, "incorrect");
                removeClass(currentWord.lastChild, "correct");
            }
        }
        // Moving window here
        moveWindow();
        // Moving cursor yayyyyyyyyyyyyyyyy
        moveCursor();
    });
}

async function main() {
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back5.jpg')`; // Sets Background Image
    document.getElementById("imgtoggle").addEventListener("click", imgtoggle); // Makes the image button active
    randWords(wordlength);
    processingWords();
    typingcheck();
    modeChanger(); // It runs event listener for modes
    // typingcheck();

    document.getElementById("title").addEventListener("click", () => {
        processingWords();
    });
}

main();
