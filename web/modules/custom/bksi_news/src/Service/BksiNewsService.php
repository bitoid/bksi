<?php

namespace Drupal\bksi_news\Service;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;

class BksiNewsService
{

  public function __construct(protected EntityTypeManagerInterface $entityTypeManager)
  {
  }

  /**
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public function bksiNewsData(string $type, int $quantity): array
  {
    // Return data with Article/project news content
    return array_map(function (Node $item) {
      $file_id = $item->field_image->target_id;
      $news_image = File::load($file_id)->getFileUri();
      $url['original_jpg'] = ImageStyle::load('original')->buildUrl($news_image);
      $url['original_webp'] = ImageStyle::load('original_webp')->buildUrl($news_image);
      $url['large_jpg'] = ImageStyle::load('large')->buildUrl($news_image);
      $url['large_webp'] = ImageStyle::load('large_webp')->buildUrl($news_image);
      $date = $item->created->value;
      $body = str_replace("&nbsp;", ' ', $item->body->summary);
      return [
        'nid' => $item->nid->value,
        'date' => $date,
        'title' => $item->title->value,
        'body' => $body,
        'news_image' => $url,
      ];
    }, $this->fetchBksiData($type, $quantity));
  }
  // Get nodes data from article/project news content type
  /**
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public function fetchBksiData(string $type, int $quantity): array
  {
    $nids = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'article')
      ->condition("field_news_type.target_id", $type, '=')
      ->sort('created', 'DESC')
      ->range(0, $quantity)
      ->execute();
    return Node::loadMultiple($nids);
  }

  /**
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public function fetchTermId(): array
  {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadTree('news');
    return array_map(function ($term) {
      return $term->tid;
    }, $terms);
  }
}
