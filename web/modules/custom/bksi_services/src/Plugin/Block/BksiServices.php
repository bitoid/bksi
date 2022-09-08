<?php
namespace Drupal\bksi_services\Plugin\Block;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;

use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;

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
//      $quantity = $config['news_quantity'];
      $slogan = $config['slogan'];
      $title = $config['title'];
      // Get data from Article content type
//      $query = \Drupal::entityQuery('node');
//      $nids = $query->condition('type', 'article')
//        ->sort('created', 'DESC')
//        ->execute();

      $news_array = [];

//      foreach ($nids as $nid) {
//        $node = Node::load($nid);
//        $file_id = $node->field_image->target_id;
//        $news_image = File::load($file_id)->getFileUri();
//        $url = ImageStyle::load('wide')->buildUrl($news_image);
//        $date = date("F Y", $node->created->value);
//        $body = str_replace("&nbsp;", ' ', $node->body->value);
//        $news_array[$nid]=[
//          'nid' => $nid,
//          'date' => $date,
//          'title' => $node->title->value,
//          'body'=> $body,
//          'news_image' => $url,
//        ];
//      }
      // Return variables for block template
      return [
        '#theme' => 'bksi_services',
        '#news_array' => $news_array,
//        '#quantity' => $quantity,
        '#slogan' => $slogan,
        '#title' => $title,
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
// Create custom fields in block
//    $form['news_quantity'] = [
//      '#type' => 'number',
//      '#title' => $this->t('News Quantity'),
//      '#default_value' => $config['news_quantity'] ?? 0,
//      '#description' => $this->t('quantity of news on the page'),
//    ];

    $form['slogan'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Slogan'),
      '#default_value' => $config['slogan'] ?? '',
      '#description' => $this->t('Slogan for news block'),
    ];

    $form['title'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Title'),
      '#default_value' => $config['title'] ?? '',
      '#description' => $this->t('Title for news block'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
//    Get custom fields data
//    $this->configuration['news_quantity'] = $form_state->getValue('news_quantity');
    $this->configuration['slogan'] = $form_state->getValue('slogan');
    $this->configuration['title'] = $form_state->getValue('title');
  }

}

