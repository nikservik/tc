$(document).ready(function(entry) {

    // Создание верхнего меню со списком типов
    types.forEach(function(item, index) {
    	$("#types").append(
    		$('<div>', {class: 'item active ' + item.color})
    			.html('<i class="toggle on icon"></i>'
    				+ index + '. '+ item.name
    			)
    		);
    });
    $("#types .item.active").on('click','i',toggleType);

    // привязка файлового меню
	$('#new').click(newFile);
	$('#open').click(openFile);
	$('#save').click(saveFile);
	$('#saveas').click(saveAsFile);

	$('#collapse').click(expander);
	$('#expand1').click(expander);
	$('#expand2').click(expander);
	$('#expand').click(expander);

    // обработка нажатий клавиатуры
    $('#structure').on('keydown', 'textarea', keyListener);
    $(document).on('keydown', fileKeyListener);

    initFile(entry);

});

function initStructure() {
    var node = newNode();
    $('.ui.comments').append(node);
    initTextarea();
}

function initTextarea() {
	// авторазмер для textarea
	$('#structure').on('change keyup keydown paste cut', 'textarea', textareaAutoresize).find('textarea').change();
	$('#structure').on('change paste cut', 'textarea', textareaChanged);
}

function textareaAutoresize(e) {
	$(e.target).height(0).height(this.scrollHeight);
} 

function textareaChanged(e) {
	setSavedStatus(false);
}

function checkVisibility(e) {
	if($(e.target).hasClass('hidden')) {
		var comments = $(e.target).children('.comments').first();
		if(comments.children(':not(".hidden")').length) {
			$(e.target).removeClass('hidden');
			if ($(e.target).parent().parent().is('.comment')) {
				$(e.target).parent().parent().change();
			}
		}
	}
}

function newNode() {
	var node = $('<div>', {class: 'comment', type:0}).on('change', checkVisibility);
	node.append($('<div>', {class: 'avatar'}).html('<i class="minus tiny grey icon"></i><i class="' + types[0].icon + ' ' + types[0].color + ' icon" type="icon"></i>'));
	node.append($('<div>', {class: 'content'}).html(
		$('<textarea>', {placeHolder: 'Новый элемент', rows: 1})
			.on('change keyup keydown paste cut', textareaAutoresize)
	));
	node.append($('<div>', {class: 'comments'}));
	node.children('.avatar').on('click','i.minus',toggleCollapse);
	return node;
}

function thisNode(target) {
	return $(target).parent().parent();
}

function previousNode(target) {
	var node = thisNode(target);
	// сначала пробуем предыдущий в списке у родителя
	var prev = node.prev();
	if (prev.is('.comment')) {
		return prev;
	} else {
		// потом пробуем родителя
		prev = node.parent().parent();
		if (prev.is('.comment')) {
			return prev;
		} else {
			// если нет родителя, то первый в списке
			return node.parent().children().first();
			// !!! тут не работает почемуто
		}
	}
}

function getType(node) {
	return parseInt(node.attr('type'));
}

function setType(node, type) {
	node.attr('type', type);
	node.find('[type="icon"]').first().removeClass()
		.addClass(types[type].icon + ' ' + types[type].color + ' icon');
}

function inheritType(node) {
	if(node.parent().parent().is('.comment')) {
		setType(node, getType(node.parent().parent()));
	}
}

function setValue(node, value) {
	node.find('textarea').val(value);
}

function toggleType(e) {
	$(e.target).toggleClass('on').toggleClass('off');
	var index = $(e.target).parent().text().split('.').shift();

	if ($(e.target).hasClass('off')) {
		$('[type=\'' + index + '\']').addClass('hidden');
		$('[type=\'' + index + '\']').change();
	} else {
		$('[type=\'' + index + '\']').removeClass('hidden');
	}
}

function toggleCollapse(e) {
	$(e.target).toggleClass('square');

	if ($(e.target).hasClass('square')) {
		thisNode(e.target).addClass('collap');
	} else {
		thisNode(e.target).removeClass('collap');
	}
}

function parentNode(node) {
	if(node.parent().parent().is('.comment')) {
		return node.parent().parent();
	} else {
		return {};
	}
}

function setSavedStatus(status) {
	saved = status;
	if (status) {
		$('#save').children('i').removeClass('red').addClass('green');
	} else {
		$('#save').children('i').removeClass('green').addClass('red');
	}
}

function expander(e) {
	if($(e.currentTarget).attr('id') == 'collapse') {
		$('.ui.comments>.comment').addClass('collap')
			.children('.avatar').children('i.minus').addClass('square');
	} else if ($(e.currentTarget).attr('id') == 'expand1') {
		$('.ui.comments>.comment').removeClass('collap')
			.children('.avatar').children('i.minus').removeClass('square');
		$('.ui.comments>.comment>.comments>.comment').addClass('collap')
			.children('.avatar').children('i.minus').addClass('square');
	} else if ($(e.currentTarget).attr('id') == 'expand2') {
		$('.ui.comments>.comment').removeClass('collap')
			.children('.avatar').children('i.minus').removeClass('square');
		$('.ui.comments>.comment>.comments>.comment').removeClass('collap')
			.children('.avatar').children('i.minus').removeClass('square');
		$('.ui.comments>.comment>.comments>.comment>.comments>.comment').addClass('collap')
			.children('.avatar').children('i.minus').addClass('square');
	} else if ($(e.currentTarget).attr('id') == 'expand') {
		$('.ui.comments .comment').removeClass('collap')
			.children('.avatar').children('i.minus').removeClass('square');
	}
}
