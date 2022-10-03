<?php

namespace Drupal\bksi_news\Plugin\Block;

use Drupal\bksi_news\Service\BksiNewsService;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\taxonomy\Entity\Term;


/**
 * Provides a 'BKSI News' Block.
 *
 * @Block(
 *   id = "bksi_news",
 *   admin_label = @Translation("BKSI News"),
 *   category = @Translation("BKSI (blocks)"),
 * )
 */

class BksiNews extends BlockBase implements ContainerFactoryPluginInterface
{

  /**
   * @var BksiNewsService
   */
  protected  BksiNewsService $newsData;

  /**
   * {@inheritdoc }
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): BksiNews {
    $instance = new static($configuration, $plugin_id, $plugin_definition);
    $instance->newsData = $container->get('bksi_news.fetcher');
    return $instance;
  }

  /**
     * @inheritDoc
     */
    public function build(): array
    {
// Get data from custom block fields
      $config = $this->getConfiguration();
      $quantity = $config['news_quantity'];
      $slogan = $config['slogan'];
      $title = $config['title'];
      $news_type = $config['news_type'];
// Return variables for block template bksi-news.html.twig
      return [
        '#theme' => 'bksi_news',
        '#news_array' => $this->newsData->bksiNewsData($news_type, $quantity),
        '#quantity' => $quantity,
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
  protected function blockAccess(AccountInterface $account)
  {
    return AccessResult::allowedIfHasPermission($account, 'access content');
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array
  {
    $config = $this->getConfiguration();
    $form= parent::blockForm($form, $form_state);
    $news_terms = $this->newsData->fetchTermId();
    $tid_projects = '';
    $tid_news = '';
    foreach ($news_terms as $term) {
      if (Term::load($term)->get('name')->value === 'Project news') {
        $tid_projects = $term;
      }
      if (Term::load($term)->get('name')->value === 'Company news') {
        $tid_news = $term;
      }
    }
// Create custom fields in block
    $form['options'] = [
      '#type' => 'value',
      '#value' => [
        $tid_projects => $this->t('Project news'),
        $tid_news => $this->t('Company news'),
      ],
    ];
    $form['news_type'] = [
      '#type' => 'select',
      '#title' => $this->t('News type'),
      '#options' => $form['options']['#value'],
      '#default_value' => $config['news_type'] ?? $form['options']['#value'][0],
      '#description' => $this->t('News type option'),
      '#required' => TRUE,

    ];
    $form['slogan'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Slogan'),
      '#default_value' => $config['slogan'] ?? '',
      '#description' => $this->t('Slogan for news block'),
      '#required' => TRUE,
    ];

    $form['title'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Title'),
      '#default_value' => $config['title'] ?? '',
      '#description' => $this->t('Title for news block'),
      '#required' => TRUE,
    ];

    $form['news_quantity'] = [
      '#type' => 'number',
      '#title' => $this->t('News Quantity'),
      '#default_value' => $config['news_quantity'] ?? 0,
      '#description' => $this->t('quantity of news on the page'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
//    Get custom fields data
    $this->configuration['news_quantity'] = $form_state->getValue('news_quantity');
    $this->configuration['slogan'] = $form_state->getValue('slogan');
    $this->configuration['title'] = $form_state->getValue('title');
    $this->configuration['news_type'] = $form_state->getValue('news_type');
  }

}

