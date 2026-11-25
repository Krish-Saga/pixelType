import english from "./assets/english.json";
const typingMain = document.getElementById("typing-main");
let previousTop = null;
const cursor = document.getElementById("cursor");
const wordinput = document.getElementById("type");
const words = document.getElementById("words");
const engwords = english.words;
let wordsOffset = 0;
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
            if (activeMode == "timemode") {
                timer.textContent = mode.textContent;
            } else if (activeMode == "wordmode") {
                wordlength = mode.textContent;
                processingWords();
            }
            wordinput.focus();
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

    moveCursor();
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
            return `<div class="word" data-wordindex="${index + 1}"  >${word}</div>`;
        })
        .join("");
    document.querySelectorAll(".word").forEach((div) => {
        div.innerHTML = div.textContent
            .split("")
            .map((letters, index) => {
                return `<span class="letter" data-letterindex="${index + 1}" data-char="${letters}">${letters}</span>`;
            })
            .join("");
    });
}
function imgtoggle() {
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back${Imgindex}.jpg')`;
    Imgindex = (Imgindex % 6) + 1;
}

async function processingWords() {
    wordsOffset = 0;
    words.style.transform = "translateY(0px)";
    randWords(wordlength);
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    wordinput.focus();
    // Don't touch this first calculates font to place cursor in it's place
    await document.fonts.ready;
    //==========================================
    requestAnimationFrame(moveCursor);
    textareaMove();
}
function typemode(toggle) {
    if (activeMode == "timemode") {
        timer.style.opacity = (+toggle).toString();
    }
    modeNumbers.style.opacity = (+!toggle).toString();
    cursor;
    nav.style.opacity = (+!toggle).toString();
    cursor.style.animation = "none";
    modediv.style.opacity = (+!toggle).toString();
}
function typingcheck() {
    wordinput.addEventListener("input", (ev) => {
        typemode(true);
        const key = ev.data;
        const currentLetter = document.querySelector(".letter.current");
        const currentWord = document.querySelector(".word.current");
        const expected = currentLetter?.getAttribute("data-char") || " ";
        if (ev.inputType === "insertText") {
            if (currentLetter) {
                addClass(
                    currentLetter,
                    key === expected ? "correct" : "incorrect",
                );
                removeClass(currentLetter, "current");
                if (currentLetter.nextElementSibling) {
                    addClass(currentLetter.nextElementSibling, "current");
                }
            } else if (expected === " ") {
                removeClass(currentWord, "current");
                removeClass(currentWord.lastElementChild, "current");
                addClass(
                    currentWord.nextElementSibling.firstElementChild,
                    "current",
                );
                addClass(currentWord.nextElementSibling, "current");
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
                }
            } else if (!currentLetter && currentWord) {
                // this is to check if we are at the end of a word ( space position)
                const lastLetter = currentWord.lastElementChild;

                addClass(lastLetter, "current");
                removeClass(lastLetter, "correct");
                removeClass(lastLetter, "incorrect");
            }
        } else if (ev.inputType === "deleteWordBackward") {
            if (currentLetter && currentWord) {
                if (currentLetter !== currentWord.firstChild) {
                    // This code blocks loops through currentLetter to firstchildSibling
                    let currentEl = currentLetter;
                    while (currentEl) {
                        console.log("fuck");
                        removeClass(currentEl, "current");
                        addClass(currentEl, "current");
                        removeClass(currentEl, "correct");
                        removeClass(currentEl, "incorrect");
                        currentEl = currentEl.previousElementSibling;
                    }
                } else if (currentWord.previousElementSibling) {
                    // From first if code block it confirms that this is the firstletter of element word and running this code
                    // This code blocks moves cursor and position to the first character of the previousWord
                    const previousWord = currentWord.previousElementSibling;
                    const previousLetter = previousWord.lastElementChild;
                    removeClass(currentWord, "current");
                    addClass(previousWord, "current");
                    addClass(previousLetter, "current");
                    let currentEl = previousLetter;

                    while (currentEl) {
                        console.log("blah");
                        console.log(currentEl);
                        removeClass(currentEl, "current");
                        addClass(currentEl, "current");
                        removeClass(currentEl, "correct");
                        removeClass(currentEl, "incorrect");
                        currentEl = currentEl.previousElementSibling;
                    }
                }
            }
        }
        console.log(key);
        console.log(expected);
        console.log(ev.inputType);
        moveWindow();
        textareaMove();
    });
    // typingMain.addEventListener("keydown", (ev) => {
    //     const currentLetter = document.querySelector(".letter.current");
    //     const expected = currentLetter?.innerHTML || " ";
    //     const currentWord = document.querySelector(".word.current");
    //     const isLetter = key.length === 1 && key !== " ";
    //     const isSpace = key === " ";
    //     const isTab = key === "Tab";
    //     const isBackspace = key === "Backspace";
    //     console.log({ key, expected });
    //     if (isTab) {
    //         ev.preventDefault();
    //         processingWords();
    //     }
    //     if (isLetter) {
    //         if (currentLetter) {
    //             addClass(
    //                 currentLetter,
    //                 key === expected ? "correct" : "incorrect",
    //             );
    //             removeClass(currentLetter, "current");
    //             if (currentLetter.nextSibling) {
    //                 addClass(currentLetter.nextSibling, "current");
    //             }
    //         } else {
    //             const incorrectLetter = document.createElement("span");
    //             incorrectLetter.innerHTML = key;
    //             incorrectLetter.className = "letter incorrect extra ";
    //             currentWord.appendChild(incorrectLetter);
    //         }
    //     }
    //     if (isSpace) {
    //         if (expected !== " ") {
    //             const lettersInvalidate = [
    //                 ...document.querySelectorAll(
    //                     ".word.current .letter:not(.correct)",
    //                 ),
    //             ];
    //             lettersInvalidate.forEach((letter) => {
    //                 addClass(letter, "incorrect");
    //             });
    //         }
    //         removeClass(currentWord, "current");
    //         addClass(currentWord.nextSibling, "current");
    //         if (currentLetter) {
    //             removeClass(currentLetter, "current");
    //         }
    //         addClass(currentWord.nextSibling.firstChild, "current");
    //     }
    //
    //     if (isBackspace) {
    //     }
    //     // Moving window here
    //     // moveWindow();
    //     // Moving cursor yayyyyyyyyyyyyyyyy
    //     moveCursor();
    // });
}

async function main() {
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back5.jpg')`; // Sets Background Image
    document.getElementById("imgtoggle").addEventListener("click", imgtoggle); // Makes the image button active
    processingWords();
    textareaMove();
    moveCursor();
    typingcheck();
    modeChanger(); // It runs event listener for modes
    // typingcheck();

    document.getElementById("title").addEventListener("click", () => {
        processingWords();
    });
}

main();
