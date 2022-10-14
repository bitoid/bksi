<?php

namespace Drupal\bksi_customers\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;

/**
 * Provides a 'Bksi Customers' Block.
 *
 * @Block(
 *   id = "bksi_customers",
 *   admin_label = @Translation("Customers block"),
 *   category = @Translation("BKSI"),
 * )
 */
class BksiCustomers extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $config = $this->getConfiguration();
    $block_title = $config['customers_title'];

    $query = \Drupal::entityQuery('node');
    $nids = $query->condition('type', 'customer')
      ->execute();

    $customers = [];

    foreach ($nids as $nid) {
      $node = Node::load($nid);
      $customer_name = $node->getTitle();
      $logo_id = $node->field_logo->target_id;
      $logo_alt = $node->field_logo->alt;
      $logo = File::load($logo_id)->getFileUri();
      $logo_url['original_jpg'] = ImageStyle::load('original')->buildUrl($logo);
      $logo_url['original_webp'] = ImageStyle::load('original_webp')->buildUrl($logo);
      $logo_url['large_jpg'] = ImageStyle::load('large')->buildUrl($logo);
      $logo_url['large_webp'] = ImageStyle::load('large_webp')->buildUrl($logo);

      // node url
      // $options = ['absolute' => TRUE];
      // $url = \Drupal\Core\Url::fromRoute('entity.node.canonical', ['node' => $nid], $options);
      // $url = $url->toString();

      $customers[$nid] = [
        'customer_name' => $customer_name,
        'logo' => $logo_url,
        'logo_alt' => $logo_alt,
      ];

    }

    return [
      '#theme' => 'bksi_customers',
      '#block_title' => $block_title,
      '#customers' => $customers,
    ];
  }

  public function blockForm($form, FormStateInterface $form_state) {
    $config = $this->getConfiguration();
    $form = parent::blockForm($form, $form_state);
    $form['customers_title'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Block Title'),
      '#default_value' => $config['customers_title'] ?? '',
      '#description' => $this->t('Title for Customers block'),
      '#required' => TRUE,
    ];
    return $form;
  }


  /**
   * {@inheritdoc}
   */
  protected function blockAccess(AccountInterface $account) {
    return AccessResult::allowedIfHasPermission($account, 'access content');
  }


    /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['customers_title'] = $form_state->getValue('customers_title');
  }


}
