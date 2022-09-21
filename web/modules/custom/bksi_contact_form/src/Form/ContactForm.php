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
        '#attributes' => ['placeholder' => t('Name')],
        '#required' => TRUE,
      ];

      $form['surname'] = [
        '#type' => 'textfield',
        '#attributes' => ['placeholder' => t('Nachname')],
        '#required' => TRUE,
      ];

      $form['email'] = [
        '#type' => 'email',
        '#attributes' => ['placeholder' => t('E-mail')],
        '#required' => TRUE,
      ];      

      $form['phone'] = [
        '#type' => 'tel',
        '#attributes' => ['placeholder' => t('Telefon')],
        '#required' => TRUE,
      ];

      $form['message'] = [
        '#type' => 'textarea',
        '#attributes' => ['placeholder' => t('Nachricht')],
        '#required' => TRUE,
      ];

      $form['file'] = [
        '#type' => 'managed_file',
        '#required' => FALSE,
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
      $form['actions']['submit'] = [
        '#type' => 'submit',
        '#value' => $this->t('Submit'),
      ];

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
          'name',
          $this->t('Sruname field must contain 2 or more characters')
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

      $fids = explode(" ", $values['file']['fids']);
      $files = \Drupal\file\Entity\File::loadMultiple($fids);
      $files_url = $files ? array_map(fn($file) => $file->getFileUri(), $files) : array("Not uploaded");
      $params = array(
        'name' => $values['name'],
        'surname' => $values['surname'],
        'email' => $values['email'],
        'message' => $values['message'],
        'node_id' => $values['node_id'],
        'files' => implode("\n", $files_url),
      );

      $mailManager = \Drupal::service('plugin.manager.mail');
      $module = $this->getFormId();
      $key = 'contact_form';
      $to = 'test@mailhog.local';
      $langcode = \Drupal::currentUser()->getPreferredLangcode();
      $send = TRUE;
      $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);

      $this->messenger()->addStatus($this->t('The form has been submitted '));
    }
    

}