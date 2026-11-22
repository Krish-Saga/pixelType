const typingMain = document.getElementById("typing-main");
async function getWords() {
    const response = await fetch("./assets/english.json");
    console.log("Status:", response.status);
    console.log("Content-Type:", response.headers.get("content-type"));
    const data = await response.json();
    const words = data.words;
    console.log(words);
}
getWords();
