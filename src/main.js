import english from "./assets/english.json";

const typingMain = document.getElementById("typing-main");
const words = document.getElementById("words");
const engwords = english.words;
let wordsOffset = 0;
let previousTop = null;

let Imgindex = 0;

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
    }

    previousTop = currentTop;
}

function addClass(el, classname) {
    el.classList.add(classname);
}

function removeClass(el, classname) {
    el.classList.remove(classname);
}

function randWords() {
    const randIndex = Math.floor(Math.random() * engwords.length);
    return `<div class="word"><span class="letter">${engwords[randIndex].split("").join('</span><span class="letter">')}</span></div>`;
}
function imgtoggle() {
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back${Imgindex}.jpg')`;
    Imgindex = (Imgindex % 6) + 1;
}

async function main() {
    typingMain.focus();
    document.body.style.backgroundImage = `url('${import.meta.env.BASE_URL}assets/back5.jpg')`;
    document.getElementById("imgtoggle").addEventListener("click", imgtoggle);
    words.innerHTML = "";
    let wordlength = 55;
    for (let i = 0; i < wordlength; i++) {
        words.innerHTML += randWords();
    }
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    // Don't touch this first calculates font to place cursor in it's place
    await document.fonts.ready;
    //==========================================
    requestAnimationFrame(moveCursor);

    typingMain.addEventListener("keydown", (ev) => {
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
            window.location.reload();
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

    document.getElementById("title").addEventListener("click", () => {
        window.location.reload();
    });
}

main();
