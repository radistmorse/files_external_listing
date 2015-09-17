<?php
/**
 * @author George Sedov <radist.morse@gmail.com>
 *
 * @copyright Copyright (c) 2015, George Sedov
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

\OC_Util::checkAdminUser();

\OCP\Util::addScript('files_external_listing', 'settings');

$defaultDir = '/home';

if (\OC_Util::runningOnWindows()) {
  $defaultDir = 'C:\\';
}

$tmpl = new \OCP\Template('files_external_listing', 'settings');
$tmpl->assign('encryption_enabled', \OC::$server->getEncryptionManager()->isEnabled());
$tmpl->assign('starting_dir', OCP\Config::getAppValue('files_external_listing', 'starting_dir', $defaultDir));
return $tmpl->fetchPage();

