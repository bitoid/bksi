(function ($, Drupal) {
    Drupal.behaviors.fileAutoUpload = {
        attach: function attach(context) {
            $(once('auto-file-upload', 'input[type="file"]', context)).on('change.autoFileUpload', function(e) {
                Drupal.file.triggerUploadButton(e);
                const fileUploadSection = document.querySelector("#file-upload-section");
                fileUploadSection.addEventListener('click', (e) => {
                    if(e.target.type === 'checkbox' && e.target.id.startsWith("edit-file-file-")){
                        const fileRemoveButton = document.querySelector('[name="file_remove_button"]');
                        fileRemoveButton.dispatchEvent(new Event('mousedown')); 
                    }
                });

            });
        },
        detach: function detach(context, settings, trigger) {
            if (trigger === 'unload') {
                $(once.remove('auto-file-upload', 'input[type="file"]', context)).off('.autoFileUpload');
            }
        }
    };
})(jQuery, Drupal);