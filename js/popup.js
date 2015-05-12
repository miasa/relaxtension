/**
 * Highlight function sends the input value of word character counts to content script
 * @param  {String} wordLengths - A string of numbers separated by spaces. @examples: "2 3 4", "3", "10 5"
 */
function highlight(wordLengths) {
  //Send word character counts to content script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {highlight: wordLengths}, function(response) {
      //Callback
      console.log(response);
    });
  });
}

//Form elements
var form = document.getElementById("relaxtension-popup"),
    input = document.getElementById("word-count");

//Set focus on input upon opening the popup
input.focus();

//Listen for submit event & highlight based on form values
form.addEventListener("submit", function(e) {
  e.preventDefault();
  highlight(input.value);
}, false);