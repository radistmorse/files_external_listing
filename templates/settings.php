<form id="files_external_listing" class="section" data-encryption-enabled="<?php echo $_['encryption_enabled']?'true': 'false'; ?>">
        <h2><?php p($l->t('External Storage Listing')); ?></h2>
        <label for="listing_starting_dir"><?php p($l->t('Starting directory for the local storage listing')); ?></label>
        <input id="listing_starting_dir" type="text" value="<?php p($_['starting_dir']); ?>"></input>
</form>
