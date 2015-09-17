<?php
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

if (\OCP\App::isEnabled('files_external')) {
  \OCP\Util::AddScript('files_external_listing', 'application');
} else {
  $msg = 'Can not enable files external listing app because the files external app is disabled';
  \OCP\Util::writeLog('files_external_listing', $msg, \OCP\Util::ERROR);
}

\OCP\App::registerAdmin('files_external_listing', 'settings');
