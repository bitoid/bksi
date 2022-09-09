<?php
namespace Drupal\bksi_career\Plugin\Block;

 use Drupal;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\Core\Block\BlockBase;

use Drupal\Core\Access\AccessResult;
use Drupal\image\Entity\ImageStyle; 
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;

/**
 * Provides a 'BKSI career ' Block.
 *
 * @Block(
 *   id = "bksi_career",
 *   admin_label = @Translation("BKSI Career"),
 *   category = @Translation("BKSI (blocks)"),
 * )
 */

class BksiCareer extends BlockBase
{

    /**
     * @inheritDoc
     */
    public function build(): array {

      $config = $this->getConfiguration();

      // Get data from custom block fields
		  $title = $config['career_title'];
      $description = $config['career_description'];
      $footer_title = $config['career_footer_title'];
      $footer_description = $config['career_footer_description'];
      $image = $config['career_image'];
      
      $file = File::load($image[0]);
      $url = $file->getFileUri();
//       Get data from Article content type
       $query = \Drupal::entityQuery('node');
       $nids = $query->condition('type', 'Job')
         ->sort('created', 'DESC')
         ->execute();
       $career_array = [];

    foreach ($nids as $nid) {
         $node = Node::load($nid);
         $career_array[$nid]=[
           'nid' => $nid,
           'job_title' => $node->field_job_title->value,
           'job_experience' => $node->field_job_experience->value,
         ];
       }

      // Return variables for block template

      return [
        '#theme' => 'bksi_career',
        '#career_array' => $career_array,
		    '#title' => $title,
        '#description' => $description,
        '#footer_title' => $footer_title,
        '#footer_description' => $footer_description,
        '#image_url' => $url,
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

    $form['career_title'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Title'),
      '#default_value' => $config['career_title'] ?? '',
      '#description' => $this->t('Title for career block'),
    ];

    $form['career_description'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Description'),
      '#default_value' => $config['career_description'] ?? '',
      '#description' => $this->t('Description for career block'),
    ];

	 $form['career_footer_title'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Footer Title'),
      '#default_value' => $config['career_footer_title'] ?? '',
      '#description' => $this->t('Footer title for career block'),
    ];

	 $form['career_footer_description'] = [
      '#type' => 'textfield',
      '#size' => 'medium',
      '#title' => $this->t('Footer Description'),
      '#default_value' => $config['career_footer_description'] ?? '',
      '#description' => $this->t('Footer Description for career block'),
    ];

    $form['career_image'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Image'),
      '#upload_location' => 'public://career_image',
      '#upload_validators' => [
        'file_validate_extensions'=> ['gif png jpg jpeg']
      ],
      '#required' => true,
      '#description' => $this->t('Image for career block'),
    ];

    return $form;

  }

  /**
   * {@inheritdoc}
   */

  public function blockSubmit($form, FormStateInterface $form_state) {  
    $this->configuration['career_title'] = $form_state->getValue('career_title');
	  $this->configuration['career_description'] = $form_state->getValue('career_description');
    $this->configuration['career_footer_title'] = $form_state->getValue('career_footer_title');
	  $this->configuration['career_footer_description'] = $form_state->getValue('career_footer_description');	
    $this->configuration['career_image'] = $form_state->getValue('career_image'); 

  }
}