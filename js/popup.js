//Form elements
var form    = document.getElementById("relaxtension-popup"),
  
    input   = document.getElementById("relaxtension-word-count"),
    workingClass = 'relaxtension-working';

/**
 * Highlight function sends the input value of word character counts to content script
 * @param  {String} wordLengths - A string of numbers separated by spaces. @examples: "2 3 4", "3", "10 5"
 */
function highlight(wordLengths) {
  //Send word character counts to content script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {highlight: wordLengths}, function(response) {
      //Callback
      console.log('popup response: ' + response);
      form.classList.remove(workingClass);
    });
  });
}

//Set focus on input upon opening the popup
input.focus();

//Listen for submit event & highlight based on form values
form.addEventListener("submit", function(e) {
  e.preventDefault();

  if(!form.classList.contains(workingClass)) {
    form.classList.add(workingClass);
    highlight(input.value);
  }
}, false);