import english from "./assets/english.json";

const typingMain = document.getElementById("typing-main");
const words = english.words;

function randWords() {
    const randIndex = Math.ceil(Math.random() * words.length);
    return `<div class="word"><span class="letter">${words[randIndex].split("").join('</span><span class="letter">')}</span></div>`;
}

async function main() {
    typingMain.innerHTML = "";
    let wordlength = 55;
    for (let i = 0; i < wordlength; i++) {
        typingMain.innerHTML += randWords();
    }
    typingMain.addEventListener("keyup", (ev) => {
        console.log(ev);
    });
}

main();
