  $.fn.extend({
      insertAtCursor: function (myValue) {
          var obj;
          if (typeof this[0].name != 'undefined') obj = this[0];
          else obj = this;
           if ($.browser.msie) {
              obj.focus();
              sel = document.selection.createRange();
              sel.text = myValue;
              obj.focus();
          } else if ($.browser.mozilla || $.browser.webkit) {
              var startPos = obj.selectionStart;
              var endPos = obj.selectionEnd;
              var scrollTop = obj.scrollTop;
              obj.value = obj.value.substring(0, startPos) + myValue + obj.value.substring(endPos, obj.value.length);
              obj.focus();
              obj.selectionStart = startPos + myValue.length;
              obj.selectionEnd = startPos + myValue.length;
              obj.scrollTop = scrollTop;
          } else {
              obj.value += myValue;
              obj.focus();
          }
      }, 

      setCursorPosition: function(pos) {
        if ($(this).get(0).setSelectionRange) {
          $(this).get(0).setSelectionRange(pos, pos);
        } 
        else if ($(this).get(0).createTextRange) {
          var range = $(this).get(0).createTextRange();
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      } 


})