(function($) {
  function checkLength(wordLengths) {
    //TODO
  }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (typeof request.highlight !== undefined) {

          var body = $('body'),
              textToSearch = body.text(),
              lengthInput = request.highlight,
              matches = [];

          //Sanitize text

          //Remove multiple line feeds
          textToSearch = textToSearch.replace(/[\n\t]{2,}/g, "\n");
          //Remove sentence ends
          textToSearch = textToSearch.replace(/[!?:;,.()"']/g, "");
          //Split by space
          var words = textToSearch.split(" ");

          //Clear previous highlights
          $("body").unhighlight();

          if(lengthInput.split(" ").length > 1) {
            //Multiple words
            var wordLengths = lengthInput.split(" ");

            //Check for number type
            $.each(wordLengths, function(i, length) {
              var lengthNumber = parseInt(length, 10);
              if(!isNaN(lengthNumber)) {
                wordLengths[i] = lengthNumber;
              }
            });

            //Check each word for first length
            if(wordLengths.length) {
              $.each(words, function(i, word) {
                if(word.length === wordLengths[0]) {
                  //First word found, check for second
                  //TODO: should be recursive
                }
              });
            }


          }else {
            //Check for number type
            lengthInput = parseInt(lengthInput, 10);
            if(!isNaN(lengthInput)) {

              //Check each word for length
              $.each(words, function(i, word) {
                if(word.length === lengthInput) {
                  matches.push(word);
                }
              });
            }
          }

          //Highlight found words
          $.each(matches, function(i, match) {
              body.highlight(match);
          });

          sendResponse('highlighted the words: ' + JSON.stringify(matches));
          return true;
      }
    }
  );
})(jQuery);