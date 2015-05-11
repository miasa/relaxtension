(function($) {

  function prepareText(textToSearch) {
    //Sanitize text

    //Combine multiple line feeds into one
    textToSearch = textToSearch.replace(/[\n\t]{2,}/g, "\n");
    //Replace line feed with space
    textToSearch = textToSearch.replace(/[\n]/g, " ");

    return textToSearch;
  }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (typeof request.highlight !== undefined) {

          var body = $('body'),
              textToSearch = prepareText(body.text()),
              wordLengths = request.highlight.split(" "),
              matches = [];

          //Check for number type
          $.each(wordLengths, function(i, length) {
            var lengthNumber = parseInt(length, 10);
            if(!isNaN(lengthNumber)) {
              wordLengths[i] = lengthNumber;
            }
          });

          var patternWordPart = "[a-zäöåéèáàëêâ\-]", //Crude replacement for utf8 \w
              patternWordBoundary = "[\\s.:,!?()\\\"']", //Crude replacement for utf8 word boundary \b
              pattern = "";

          $.each(wordLengths, function(i, length) {
            pattern += (i === 0 ? patternWordBoundary : "\\s") + patternWordPart + "{" + length + "}";
          });

          pattern += patternWordBoundary;

          //console.log('text', textToSearch);
          console.log('pattern', pattern);

          var regex = new RegExp(pattern,"gi"), 
              matches = [], 
              match;

          while(match = regex.exec(textToSearch)) {
              matches.push(match);
              regex.lastIndex = match.index + 1; //For overlapping matches
          }

          //var matches = textToSearch.match(new RegExp(pattern, "gi"));

          console.log('matches', matches);

          //Clear previous highlights
          body.unhighlight();

          if(matches && matches.length) {
            
            //Sanitize even more
            $.each(matches, function(i, match) {
              matches[i] = $.trim(matches[i]);
              matches[i] = matches[i].replace(new RegExp("[.:,!?()\\\"']", "gi"), "");
            });

            //Highlight found words
            body.highlight(matches, {className: 'relaxtension-highlight'});
          }else {
            alert("No matches found");
          }

          console.log('matches after', matches);

          //For debugging purposes
          sendResponse('highlighted the words: ' + JSON.stringify(matches));
          return true;
      }
    }
  );

})(jQuery);