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
  $('#files_external_listing').on('change keyup paste', 'input#listing_starting_dir', function () {
    var timer = $(this).data('save-timer');
    var value = this.value;
    clearTimeout(timer);
    timer = setTimeout(function() {
      OC.AppConfig.setValue('files_external_listing', 'starting_dir', value);
    }, 2000);
    $(this).data('save-timer', timer);
  });
});
