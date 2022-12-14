<?php
namespace Drupal\bksi_services\Plugin\Block;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;

use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;

/**
 * Provides a 'BKSI Services' Block.
 *
 * @Block(
 *   id = "bksi_services",
 *   admin_label = @Translation("BKSI Services"),
 *   category = @Translation("BKSI (blocks)"),
 * )
 */

class BksiServices extends BlockBase
{

    /**
     * @inheritDoc
     */
    public function build(): array {

      $config = $this->getConfiguration();
      // Get data from custom block fields

      $slogan = $config['slogan'];
      $block_title = $config['block_title'];
      // Get data from Article content type

      $query = \Drupal::entityQuery('node');
      $nids = $query->condition('type', 'Services')
        ->sort('field_service_weight', 'ASC')
        ->execute();

      $services = [];


      foreach ($nids as $nid) {
        $node = Node::load($nid);

        $file_id = $node->field_service_icon->target_id;
        $service_image = File::load($file_id)->getFileUri();

        $title = $node->title->value;
        $summary = $node->field_service_summary->getValue();

        $services[]=[
          'nid' => $nid,
          'title' => $title,
          'service_image' => $service_image,
          'summary' => $summary,
          'link_text' => "Mehr zu $title"
        ];
      }

      // Return variables for block template
      return [
        '#theme' => 'bksi_services',
        '#services' => $services,
        '#slogan' => $slogan,
        '#title' => $block_title,
        '#cache' => [
          'max-age' => 0,
        ],
      ];
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
  public function blockForm($form, FormStateInterface $form_state): array
  {
    $config = $this->getConfiguration();
    $form= parent::blockForm($form, $form_state);

    $form['slogan'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Slogan'),
      '#default_value' => $config['slogan'] ?? '',
      '#description' => $this->t('Slogan for service block'),
    ];

    $form['block_title'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Block title'),
      '#default_value' => $config['block_title'] ?? '',
      '#description' => $this->t('Title for service block'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
//    Get custom fields data
    $this->configuration['slogan'] = $form_state->getValue('slogan');
    $this->configuration['block_title'] = $form_state->getValue('block_title');
  }

}

