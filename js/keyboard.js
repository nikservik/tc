function keyListener(event) {
	// Return = добавление узла после этого
	// Shift + Return = добавление перед этим
	// console.log(event.keyCode)
	if(event.which == 13) { // Return
		event.preventDefault();
		// добавить узел после этого
		var node = newNode();
		if(event.shiftKey) {
			node.insertBefore(thisNode(event.target));
		} else {
			node.insertAfter(thisNode(event.target));
		}
		inheritType(node);
		node.find('textarea').first().focus();
		setSavedStatus(false);
		return false;
	}

	// Tab = добавление дочернего узла
	if (event.keyCode == 9) {
		event.preventDefault();
		if(!thisNode(event.target).children('.comments').length) {
			thisNode(event.target).append($('<div>', {class: 'comments'}))
		}
		var node = newNode();
		if(event.shiftKey) {
			if(thisNode(event.target).parent().parent().is('.comment')) {
				node.insertAfter(thisNode(event.target).parent().parent());
			}
		} else {
			thisNode(event.target).children('.comments').append(node);
		}
		inheritType(node);
		node.find('textarea').first().focus();
		setSavedStatus(false);
		return false;
	}

	// Cmd + Del = удаление узла
	if(event.keyCode == 8 && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		var prev = previousNode(event.target);
		thisNode(event.target).remove();
		prev.find('textarea').first().focus();
		setSavedStatus(false);
		return false;
	}

	// Cmd + цифра = назначение типа
	if(event.which >= 48 && event.which <= 57 && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		var type = event.which - 48;
		if(type < types.length) {
			setType(thisNode(event.target), type);
			setSavedStatus(false);
		}
		return false;
	}

	// Cmd + left = сдвиг влево
	if (event.which == 37 && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		if(thisNode(event.target).parent().parent().is('.comment')) {
			var parent = thisNode(event.target).parent().parent()
			var node = thisNode(event.target).detach();
			node.insertAfter(parent);
			node.find('textarea').first().focus();
			setSavedStatus(false);
		}
		return false;
	}
	// Cmd + right = сдвиг вправо
	if (event.which == 39 && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		var prev = thisNode(event.target).prev();
		if (prev.is('.comment')) {
			var node = thisNode(event.target).detach();
			if(!prev.children('.comments').length) {
				prev.append($('<div>', {class: 'comments'}))
			}
			prev.children('.comments').append(node);
			node.find('textarea').first().focus();
			setSavedStatus(false);
		}
		return false;
	}

	// Cmd + up = фокус вверх
	if (event.keyCode == 38 && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		// сначала пробуем предыдущий в списке у родителя
		var prev = thisNode(event.target).prev();
		if (prev.is('.comment')) {
			if(prev.find('.comment').length) {
				prev.find('.comment').find('textarea').focus();
			} else {
				prev.find('textarea').first().focus();
			}
		} else {
			// потом пробуем родителя
			prev = thisNode(event.target).parent().parent();
			if (prev.is('.comment')) {
				prev.find('textarea').first().focus();
			}
		}
		return false;
	}

	// Cmd + down = фокус вниз
	if (event.keyCode == 40 && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		// сначала пробуем найти первый дочерний узел
		var next = thisNode(event.target).find('.comment').first();
		if (next.is('.comment')) {
			next.find('textarea').first().focus();
		} else {
			// потом пробуем следующий в списке у родителя
			next = thisNode(event.target).next();
			if (next.is('.comment')) {
				next.find('textarea').first().focus();
			} else {
				// если следующего нет, то поднимаемся по уровням вверх
				var parent = thisNode(event.target).parent().parent();
				while(parent.is('.comment')) {
					if(parent.next().is('.comment')) {
						parent.next().find('textarea').first().focus();	
						break;
					} else {
						parent = parent.parent().parent();
					}
				}
			}
		}
		return false;
	}
}

function fileKeyListener(event) {
	// Cmd + S = сохранить файл
	if (event.which == 83 && (event.ctrlKey || event.metaKey)) {
		saveFile();
		return false;
	}
	// Cmd + O = открыть файл
	if (event.which == 79 && (event.ctrlKey || event.metaKey)) {
		openFile();
		return false;
	}
}