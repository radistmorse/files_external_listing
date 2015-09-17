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

\OCP\JSON::checkAppEnabled('files_external_listing');
\OCP\JSON::checkLoggedIn();
\OCP\JSON::callCheck();
\OC_JSON::checkAdminUser();

$defaultDir = '/home';

if (\OC_Util::runningOnWindows()) {
  $defaultDir = 'C:\\';
}

$localroot = OCP\Config::getAppValue('files_external_listing', 'starting_dir', $defaultDir);

if (isset($_POST['path'])) {
	$path = realpath($_POST['path']);

	if ( (strpos($path,$localroot) === 0) or empty($_POST['path']) ) {
		if ( empty($_POST['path']) ) {
			$path = $localroot;
		}
		if (!is_dir($path)) {
			//path is incorrect or is a file. Nothing to do, we work only with dirs
			OCP\JSON::error(array('data' => array('message' => 'Incorrect path: ' . $_POST['path'])));
		} elseif (isset($_POST['isnotempty']) && ($_POST['isnotempty'])) {
			//we only check if the dir has subdirs
			$dirs = glob($path . '/*', GLOB_ONLYDIR);
			OCP\JSON::success(array('data' => !empty($dirs)));
		} elseif (isset($_POST['ascendpath']) && ($_POST['ascendpath'])) {
			//we must return the full ascendance path, where
			//key is the predecessor dir and value is a subdir
			//which must be selected in corresponding selector
			//array( '/'      => '/a',
			//       '/a'     => '/a/b',
			//       '/a/b'   => '/a/b/c',
			//       '/a/b/c' => '/a/b/c/d' )
			$dirs = array();
			$curdir = $path;
			$selectdir = $path;
			$parentname = dirname($path);
			$safeguard = 50; //in case of some funny directory loops
			while (($parentname !== $curdir) && ($safeguard > 0)) {
				$safeguard -= 1;
				$curdir = $parentname;
				$parentname = dirname($curdir);
				$dirs[$curdir] = $selectdir;
				$selectdir = $curdir;
			}
			if ($safeguard === 0) {
				//some funny directory loop
				OCP\JSON::error(array('data' => array('message' => 'An error occured while exploring the path: ' . $_POST['path'])));
			} else {
				foreach( $dirs as $dir => $subdir) {
					if ( strpos($dir,$localroot) !== 0 ) {
						unset($dirs[$dir]);
					}
				}
				OCP\JSON::success(array('data' => $dirs));
			}
		} else {
			//normal directory listing, return an array
			//where key is a sibdir name and value is it's full path
			$dirs = array();
			foreach(glob($path . '/*', GLOB_ONLYDIR) as $subdir) {
				$dirs[basename($subdir)] = $subdir;
			}
			OCP\JSON::success(array('data' => $dirs));
		}
	} else {
		OCP\JSON::success(array('message' => 'outside of starting dir'));
	}
} else {
	//no path provided
	OCP\JSON::error(array('data' => array('message' => 'Please provide the path for directory listing')));
}

