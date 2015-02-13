function highlight(wordLengths) {
  //Send word character counts to content script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {highlight: wordLengths}, function(response) {
      console.log(response);
    });
  });
}

//Form elements
var form = document.getElementById("relaxtension-popup"),
    input = document.getElementById("word-count");

//Set focus on popup init
input.focus();

//Listen for submit event
form.addEventListener("submit", function(e) {
  e.preventDefault();
  highlight(input.value);
}, false);