import english from "./assets/english.json";

const typingMain = document.getElementById("typing-main");
const words = document.getElementById("words");
const engwords = english.words;

function moveCursor() {
    const nextLetter = document.querySelector(".letter.current");
    const wordEnd = document.querySelector(".word.current");
    const cursor = document.getElementById("cursor");
    const newposition = (nextLetter || wordEnd).getBoundingClientRect();
    cursor.style.top = newposition.top + 2 + "px";
    cursor.style.left = newposition[nextLetter ? "left" : "right"] + "px";
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

async function main() {
    typingMain.focus();
    words.innerHTML = "";
    let wordlength = 55;
    for (let i = 0; i < wordlength; i++) {
        words.innerHTML += randWords();
    }
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    moveCursor();

    typingMain.addEventListener("keydown", (ev) => {
        const key = ev.key;
        const currentLetter = document.querySelector(".letter.current");
        const expected = currentLetter?.innerHTML || " ";
        const currentWord = document.querySelector(".word.current");
        const isLetter = key.length === 1 && key !== " ";
        const isSpace = key === " ";
        console.log({ key, expected });
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
        // Moving cursor yayyyyyyyyyyyyyyyy
        moveCursor();
    });
}

main();
