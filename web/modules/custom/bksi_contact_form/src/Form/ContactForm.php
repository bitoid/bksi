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
        '#type' => 'file',
        '#required' => FALSE,
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
      // @TODO Validation
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
      $name = $form_state->getValue('name');
      $this->messenger()->addStatus($this->t("Thank you, " . $name . ""));
    }


}