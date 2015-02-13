function highlight(wordLengths) {

  console.log('popup.js find words with length: ' + wordLengths);

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {highlight: wordLengths}, function(response) {
      console.log(response);
    });
  });

  //chrome.tabs.executeScript(null, {file: "content_script.js"});
}

var form = document.getElementById("relaxtension-popup"),
    input = document.getElementById("word-count");

input.focus();

form.addEventListener("submit", function(e) {
  e.preventDefault();

  var inputVal = input.value;
  highlight(inputVal);

}, false);