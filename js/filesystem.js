var currentEntry = null;
var autoSaveMode = false;
var saved = true;

function initFile(entry) {
  $('#open').click(openFile);
  $('#save').click(saveFile);
  $('#saveas').click(saveAsFile);
  chrome.runtime.getBackgroundPage(function(bg) {
    if (bg.entryToLoad)
      loadEntry(bg.entryToLoad);
    else
      initStructure();
  });
  setSavedStatus(true);
}

function openFile() {
  chrome.fileSystem.chooseEntry({
    'type': 'openWritableFile',
    'accepts': [{
      'description':'Структура тренинга',
      'mimeTypes':['application/ef-structure'],
      'extensions':['efstruct','efst']
    }]
  }, loadEntry);
}

function autoSave() {
  if(autoSaveMode && currentEntry) {
    saveToEntry(currentEntry);
  }
}

function saveFile() {
  // console.log(JSON.stringify(getStructure($('.ui.comments').children())));
  if (currentEntry) {
    saveToEntry(currentEntry);
  } else {
    saveAsFile();
  }
}

function saveAsFile() {
  chrome.fileSystem.chooseEntry({
    'type': 'saveFile',
    'accepts': [{
      'description':'Структура тренинга',
      'mimeTypes':['application/ef-structure'],
      'extensions':['efstruct','efst']
    }]
  }, saveToEntry);
}

function setTitle() {
  chrome.fileSystem.getDisplayPath(
      currentEntry,
      function(path) {
        $('#path').text(path);
        var file = path.split('/').pop();
        file = file.split('.');
        file.pop();
        file = file.join('.');
        $('#title').text(file)
      });
}

function loadEntry(entry) {
  currentEntry = entry;
  setTitle();
  entry.file(readFile);
}

function readFile(file) {
  var reader = new FileReader();
  reader.onloadend = function(e) {
    $('.ui.comments').children().remove();
    makeStructure(JSON.parse(this.result), $('.ui.comments'));
    initTextarea();
    setSavedStatus(true);
  };
  reader.readAsText(file);
}

function saveToEntry(entry) {
  currentEntry = entry;
  setTitle();

  var blob = new Blob([JSON.stringify(getStructure($('.ui.comments').children('.comment')))], {type: 'text/plain'});
  entry.createWriter(function(writer) {
    writer.onwrite = function() {
      writer.onwrite = null;
      writer.write(blob);
    }
    writer.truncate(blob.size);
    setSavedStatus(true);
  });
}

// Возвращает массив объектов для сохранения
function getStructure(nodeList) {
  var list = []
  nodeList.each(function(index) {
    list[index] = {
      type: $(this).attr('type'),
      value: $(this).find('textarea').first().val(),
      children: []
    };
    if ($(this).children('.comments').length) {
      list[index].children = getStructure($(this).children('.comments').children('.comment'));
    }
  });
  return list;
}

// из массива объектов делает html-код узлов и добавляет их к node
function makeStructure(structure, container) {
  for (var i = 0; i < structure.length; i++) {
    var nNode = newNode();
    setType(nNode, structure[i].type);
    setValue(nNode, structure[i].value);
    container.append(nNode);
    if(structure[i].children.length) {
      makeStructure(structure[i].children, nNode.children('.comments'));
    }
  }
}