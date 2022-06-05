var POST_URL = "REDACTED";

function onSubmit(e) {
    var form = FormApp.getActiveForm();
    var allResponses = form.getResponses();
    var latestResponse = allResponses[allResponses.length - 1];
    var response = latestResponse.getItemResponses();
    var items = [];
    var currentEmbedCharacterNum = 0

    for (var i = 0; i < response.length; i++) {
        var question = response[i].getItem().getTitle();
        var answer = response[i].getResponse();

        if (answer == [] || answer == "") {
            continue;
        }
        if (question.length > 256){
            question = question.substring(0, 220) + "...";
        } 

        if (answer instanceof Array) { //Multiple Choice Array

          var answers = "";
          for (var j = 0; j < answer.length; j++) {
            answers += answer[j] + "\n";
            currentEmbedCharacterNum += answer[j].length;
          }
          if (answers != "") {
            items.push({
              "name": question,
              "value": answers,
              "inline": false
            });
          }

        } else { //Regular Text Block

          try {
              var parts = answer.match(/[\s\S]{1,750}/g) || [];
          } catch (e) {
              var parts = answer;
          }
          parts.forEach(function (item) {
            currentEmbedCharacterNum += item.length;
            items.push({
              "name": question,
              "value": item,
              "inline": false
            });
          });

        }

        if (currentEmbedCharacterNum >= 2500) {
            sendEmbed(items);
            Utilities.sleep(50);
            currentEmbedCharacterNum = 0;
            items = [];
        }
    }

    sendEmbed(items);

};

function sendEmbed(items){
  console.log(items);
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
    },
    "payload": JSON.stringify({
      "content": "",
      "embeds": [{
        "title": "Application Response",
        "color": 33023, // This is optional, you can look for decimal colour codes at https://www.webtoolkitonline.com/hexadecimal-decimal-color-converter.html
        "fields": items,
        "image": {
          "url": "https://i.ibb.co/GpKSr3Z/test.png"
        },
        "footer": {
          "text": "" //Some footer here
        }
      }]
    })
  };

  // Post the data to the webhook.
  UrlFetchApp.fetch(POST_URL, options);
}
