/**
 * @author George Sedov <radist.morse@gmail.com>
 *
 * @copyright Copyright (c) 2015, George Sedov.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

$(document).ready(function() {
	var ajaxFilePath = OC.filePath('files_external_listing', 'ajax', 'application.php');

	//construct selectors for existing shares
	$('#externalStorage tbody tr.\\\\OC\\\\Files\\\\Storage\\\\Local').each(function() {
		var localPath = $(this).find('[data-parameter="datadir"]').val();
		var config = $(this).find('td.configuration');
		$(config).append('<span id="localroot"></span>');
		$(config).append('<a class="button local-dir-up ui-state-disabled">&larr;</a>');
		$(config).append('<a class="button local-dir-down ui-state-disabled">&rarr;</a>');

		$.post(ajaxFilePath, { path: localPath, ascendpath: true }, function(result) {
			if (result && result.status === 'success') {
				var lastSpan = $(config).find('span').last();
				if (result.message === 'outside of starting dir') {
					$(lastSpan).append('<span id="error">The directory is outside of the starting dir</span>');
					return;
				}
				var keys = Object.keys(result.data).sort();
				var lastValue = result.data[keys[keys.length -1]];

				var mySelect = function(value) {
					return function(selector) {
						$(selector).val(value);
						if (value === lastValue) {
							$(selector).trigger('change');
						}
					};
				};

				for(var i = 0; i < keys.length; i++) {
					var key = keys[i];
					createDirSelector(lastSpan, key, mySelect(result.data[key]));
					$(lastSpan).append('<span id="'+key+'"></span>');
					lastSpan = $(lastSpan).find('span').last();
				}
			} else {
				OC.dialogs.alert(result.data.message,
					t('files_external', 'Error getting the predecessors for ' + localPath ));
			}
		});
	});

	//construct selectors for newly created shares
	$('form#files_external #externalStorage').on('change', 'tr#addMountPoint', function() {
		if (this.className === '\\OC\\Files\\Storage\\Local') {
			var config = $(this).find('td.configuration');
			$(config).append('<span id="localroot"></span>');
			$(config).append('<a class="button local-dir-up ui-state-disabled">&larr;</a>');
			$(config).append('<a class="button local-dir-down ui-state-disabled">&rarr;</a>');
			createDirSelector($(config).find('span'),'');
		}
	});

	//ascend one level
	$('form#files_external #externalStorage').on('click', '.local-dir-up:not(.ui-state-disabled)', function(event) {
		event.preventDefault();
		$(this).addClass('ui-state-disabled');
		var config = $(this).parent();
		var lastSpan = $(config).find('span').last();
		if ( $(lastSpan).attr('id') !== 'localroot') {
			$(lastSpan).remove();
		}
		$(config).find('span').last().find('select').trigger('change');
	});

	//descend one level
	$('form#files_external #externalStorage').on('click', '.local-dir-down:not(.ui-state-disabled)', function(event) {
		event.preventDefault();
		$(this).addClass('ui-state-disabled');
		var config = $(this).parent();
		var downButton = $(config).find('.local-dir-down');
		var lastSpan = $(config).find('span').last();
		var lastSelect = $(lastSpan).find('select');
		var currentPath = $(lastSelect).find('option:selected').val();
		$.post(ajaxFilePath, { path: currentPath, isnotempty: true }, function(result) {
			if (result && result.status === 'success') {
				if (result.data) {
					$(downButton).removeClass('ui-state-disabled');
					$(lastSpan).append('<span id="'+$(lastSelect).attr('id')+'"></span>');
					createDirSelector($(lastSpan).find('span'),currentPath);
				} else {
					$(downButton).addClass('ui-state-disabled');
				}
			} else {
				OC.dialogs.alert(result.data.message,
					t('files_external', 'Error getting the local directory listing in' + currentPath ));
			}
		});
	});

	//some selector was changed
	$('form#files_external #externalStorage').on('change', '.local-file-chooser', function() {
		$(this).parent().find('span').remove();

		var path = $(this).find('option:selected').val();
		var upButton = $(this).parents('td.configuration').find('.local-dir-up');
		var downButton = $(this).parents('td.configuration').find('.local-dir-down');

		if ($(this).parent().attr('id') === 'localroot') {
			$(upButton).addClass('ui-state-disabled');
		} else {
			$(upButton).removeClass('ui-state-disabled');
		}

		$.post(ajaxFilePath, { path: path, isnotempty: true }, function(result) {
			if (result && result.status === 'success') {
				if (result.data) {
					$(downButton).removeClass('ui-state-disabled');
				} else {
					$(downButton).addClass('ui-state-disabled');
				}
			} else {
				OC.dialogs.alert(result.data.message,
					t('files_external', 'Error getting the local directory listing in' + path ));
			}
		});
		if ($(this).parents('td.configuration').find('[data-parameter="datadir"]').val() !== path) {
			$(this).parents('td.configuration').find('[data-parameter="datadir"]').val(path);
			$(this).parents('td.configuration').find('[data-parameter="datadir"]').trigger('keyup');
		}
	});

	//places a selector to $(dirSpan) with the subfolders of 'path'
	//calls callback when (if) done if provided, or triggers the selector change otherwise
	function createDirSelector(dirSpan, path, callback) {
		$.post(ajaxFilePath, { path: path }, function(result) {
			if (result && result.status === 'success') {
				$(dirSpan).prepend('<select id="'+path+'" class="local-file-chooser"></select>');
				var selector = $(dirSpan).find('select').first();
				$.each(result.data, function (dir, path) {
					$(selector).append('<option value="'+path+'">'+dir+'</option>');
				});
				if (typeof callback === 'function') {
					callback(selector);
				} else {
					$(dirSpan).find('select').trigger('change');
				}
			} else {
				OC.dialogs.alert(result.data.message,
					t('files_external', 'Error getting the local directory listing in ' + path ));
			}
		});
	}
});

