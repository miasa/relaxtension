
var Relaxtension = (function() {
  var api = {};

  /**
   * Sanitizes the text to search
   * 
   * @param  {string} textToSearch - The raw text to sanitize
   * 
   * @return {string}              - Sanitized text
   */
  function prepareText(textToSearch) {
    //Combine multiple line feeds into one
    textToSearch = textToSearch.replace(/[\n\t]{2,}/g, "\n");
    //Replace line feed with space
    textToSearch = textToSearch.replace(/[\n]/g, " ");

    return textToSearch;
  }

  /**
   * Sanitizes the input, only numbers are relevant
   * 
   * @param {string} input - Input field value
   * 
   * @return {array<number>} sanitized - Array of word lengths
   */
  function checkInput(input) {
    var wordLengths = input.trim().split(" "),
        sanitized   = wordLengths.map(Number).filter(item => !isNaN(item)); //Only numbers are relevant

    return sanitized;
  }

  /**
   * Creates the regex pattern for wanted word lengths
   * Contains a crude replacement for ut8 words
   * 
   * @param {array<number>} wordLengths - Array of numbers
   * 
   * @return {string} pattern - Regex pattern
   */
  function createPattern(wordLengths) {
    var patternWordPart     = "[a-zäöåéèáàëêâ\-]", //Crude replacement for utf8 \w
        patternWordBoundary = "[\\s.:,!?()\\\"']", //Crude replacement for utf8 word boundary \b
        pattern             = "";
    
    //Create regex pattern
    for(var i = 0; i < wordLengths.length; i++) {
      //First word begins with wordBoundary, 
      //rest with whitespace since we might be looking for multiple words right after another
      pattern += (i === 0 ? patternWordBoundary : "\\s") + patternWordPart + "{" + wordLengths[i] + "}";
    }

    //Append wordboundary to end of pattern
    pattern += patternWordBoundary;

    //console.log('pattern', pattern);

    return pattern;
  }

  /**
   * Checks for matches on page
   * 
   * @param {string} pattern      - Regex pattern
   * @param {string} textToSearch - Page body text content
   * 
   * @return {boolean|array} - Array of matched words or false if none found
   */
  function checkMatches(pattern, textToSearch) {
    var regex   = new RegExp(pattern,"gi"), 
        matches = [], 
        match;

    //Check for matches
    while(match = regex.exec(textToSearch)) {
      var sanitizedMatch = match[0];

      //Remove whitespace from beginning and end
      sanitizedMatch = sanitizedMatch.trim();
      //Remove punctuations, parentheses etc.
      sanitizedMatch = sanitizedMatch.replace(new RegExp("[.:,!?()\\\"']", "gi"), "");
      
      //No duplicates or empty values
      if(sanitizedMatch.length && matches.indexOf(sanitizedMatch) === -1) {
        matches.push(sanitizedMatch);
      }

      //Also check overlapping matches
      regex.lastIndex = match.index + 1;
    }

    //console.log('matches', matches);

    if(matches && matches.length) {
      return matches;
    } else {
      return false;
    }

  }

  /**
   * Chrome extension message listener
   * 
   * @param {*} request - Form submit values
   * @param {*} sender
   * @param {*} sendResponse
   * 
   * @return {boolean}
   */
  function listener(request, sender, sendResponse) {

    if(typeof request.highlight !== undefined) {
      
      var body         = document.body,
          markInstance = new Mark(body),
          textToSearch = prepareText(body.innerText),
          wordLengths  = checkInput(request.highlight),
          pattern      = createPattern(wordLengths),
          matches      = checkMatches(pattern, textToSearch);


      //Clear previous highlights always
      markInstance.unmark();

      if(matches) {

        console.log(matches);
        
        //Highlight found words
        markInstance.mark(matches, {
          className          : "relaxtension-highlight",
          diacritics         : false,
          separateWordSearch : false,
          accuracy   : {
            value    : "exactly",
            limiters : [",", ".", ":", ";", "!", "?"]
          }
        });

        //Scroll to first found match
        var firstMatch = document.querySelector('.relaxtension-highlight');
        window.scroll(0, firstMatch.offsetTop);

      }else {
        alert("No matches found");
      }

      //For debugging purposes
      sendResponse('highlighted the words: ' + JSON.stringify(matches));
      return true;
    }
  }
  api.listener = listener;

  return api;
})();
  
chrome.runtime.onMessage.addListener(Relaxtension.listener);