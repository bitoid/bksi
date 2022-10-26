<?php

namespace Drupal\bksi_contact_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;


class ContactForm extends FormBase {

    /**
     * Getter method for Form ID.
     *
     * @return string
     *   The unique ID of the form defined by this class.
     */
    public function getFormId() {
      return 'bksi_contact_form';
    }


    /**
     *
     * @param array $form
     *   Default form array structure.
     * @param \Drupal\Core\Form\FormStateInterface $form_state
     *   Object containing current form state.
     *
     * @return array
     *   The render array defining the elements of the form.
    */
    public function buildForm(array $form, FormStateInterface $form_state) {

      $form['#attributes'] = array('enctype' => 'multipart/form-data');
      $form['#cache']['max-age'] = 300;

      $form['name'] = [
        '#type' => 'textfield',
        '#attributes' => ['placeholder' => $this->t('Name')],
        '#required' => TRUE,
      ];

      $form['surname'] = [
        '#type' => 'textfield',
        '#attributes' => ['placeholder' => $this->t('Nachname')],
        '#required' => TRUE,
      ];

      $form['email'] = [
        '#type' => 'email',
        '#attributes' => ['placeholder' => $this->t('E-mail')],
        '#required' => TRUE,
      ];

      $form['phone'] = [
        '#type' => 'tel',
        '#attributes' => ['placeholder' => $this->t('Telefon')],
        '#required' => TRUE,
      ];

      $form['message'] = [
        '#type' => 'textarea',
        '#attributes' => ['placeholder' => $this->t('Nachricht')],
        '#required' => TRUE,
      ];

      $form['file'] = [
        '#type' => 'managed_file',
        '#required' => TRUE,
        '#multiple' => TRUE,
        '#upload_validators' => [
          'file_validate_extensions' => array('pdf'),
          'file_validate_size' => array(5000000)
        ],
        '#upload_location' => 'public://form_files/'
      ];

      $form['policy_checkbox'] = [
        '#type' => 'checkbox',
        '#required' => TRUE,
      ];


      // Add a submit button that handles the submission of the form.
      if (!$this->messenger()->all()['status'][0]) {
        $form['actions']['submit'] = [
          '#type' => 'submit',
          '#value' => $this->t('Submit'),
        ];
      }

      $form['#theme'] = 'contact_form';

      return $form;
    }


    /**
     * Implements form validation.
     *
     * @param array $form
     *   The render array of the currently built form.
     * @param \Drupal\Core\Form\FormStateInterface $form_state
     *   Object describing the current state of the form.
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {
      $values = ($form_state->getUserInput());

      if (strlen($values['name']) < 2) {
        $form_state->setErrorByName(
          'name',
          $this->t('Name field must contain 2 or more characters')
        );
      }

      if (strlen($values['surname']) < 2) {
        $form_state->setErrorByName(
          'surname',
          $this->t('Surname field must contain 2 or more characters')
        );
      }

      if (!\Drupal::service('email.validator')->isValid($values['email'])) {
        $form_state->setErrorByName(
          'email',
          $this->t('The email address @mail is not valid.', array('@mail' => $values['email']))
        );
      }

      if (!$values['policy_checkbox']) {
        $form_state->setErrorByName(
          'policy_checkbox',
          $this->t('To continue, you must agree to the privacy policy')
        );
      }
    }


    /**
     * Implements a form submit handler.
     *
     * @param array $form
     *   The render array of the currently built form.
     * @param \Drupal\Core\Form\FormStateInterface $form_state
     *   Object describing the current state of the form.
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {
      $values = $form_state->getUserInput();
      $contact_email = \Drupal::config('system.site')->get('contact_email_form');
      $fids = explode(" ", $values['file']['fids']);
      $files = \Drupal\file\Entity\File::loadMultiple($fids);
      $files_url = array_map(fn($file) => $file->getFileUri(), $files);
      $params = array(
        'name' => $values['name'],
        'surname' => $values['surname'],
        'email' => $values['email'],
        'message' => $values['message'],
        'node_id' => $values['node_id'],
        'attachments' => array_map
        (
          fn($file) => ['filecontent' => file_get_contents($file), 'filename' => 'asdasd.pdf'], $files_url
        ),
      );

      $mailManager = \Drupal::service('plugin.manager.mail');
      $module = $this->getFormId();
      $key = 'contact_form';
      $to = $contact_email;
      $langcode = \Drupal::currentUser()->getPreferredLangcode();
      $send = TRUE;
      $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);

      $this->messenger()->addStatus($this->t('Vielen Dank für Deine Bewerbung! Wir werden Deine Bewerbung schnellstmöglich bearbeiten und uns melden. Dies kann jedoch auch einmal einige Tage dauern.'));
    }


}
