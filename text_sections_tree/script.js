$(document).ready(function(){
  $('#jstree').jstree({
    "core" : {
      "check_callback": true,
      "themes" : {
        "variant" : "large"
      }
    }
  });
  var tree = $('#jstree').jstree(true);

  var quill = new Quill('#editor', {
    theme: 'snow'
  });

  $(document).on('click', '#btn_parse', function() {
    parseDocument();
    $(this).blur();
  })

  var parseDocument = () => {
    if (!confirm('Are you sure? This will redefine the tree.')){
      return;
    }
    tree.select_all(true);
    tree.delete_node(tree.get_selected());  // remove all tree nodes
    editorContent = quill.root.innerHTML;
    parseText(editorContent, 1, tree);
  }

  var parseText = (fragment, level, tree, parentNode=null) => {
    var tag = "<h" + level;
    var innerFragment = fragment.slice(fragment.indexOf(tag));  // drop all text preceeding the first header tag
    if (level > 5 || innerFragment.length == 0){
      return;                                                   // Return all remaining text if achieved the deepest given level or if there is no text inside current level
    }

    var arr = innerFragment.split(tag)      // split the text by the tags
    arr.shift()                             // exclude text segment before the first sub-tag
    arr.forEach((lowerPart, arrIndex) => {
      var lowerPart = tag.concat(lowerPart);
      var index = arrIndex + level * 10 + new Date().getTime();
      var newNode = tree.create_node(parentNode, {text: getTagTitle(lowerPart, level), data: { itemId: -index}});
      parseText(lowerPart, level + 1, tree, newNode);
    })
    return;
  }
  var getTagTitle = function(text, level){
    var innerText = text.slice(text.indexOf(">") + 1, text.indexOf("</h" + level)) // Everythin inside the tag is used as a node's title
    return innerText.replace(/<[^>]*>/gm, '');
  }
})

