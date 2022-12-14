<?php

namespace Drupal\projects\Controller;

use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;


class ProjectsController extends ControllerBase {
  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * GEDCurrencyController constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * @param ContainerInterface $container
   * @return GEDCurrencyController|static
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  public function data () {
    return new JsonResponse([
      'data' => $this->getProjectsData(),
      'method' => 'GET',
    ]);
  }

  public function getProjectsData () {

    $node_storage = $this->entityTypeManager->getStorage('node');
    $nids = $node_storage->getQuery()
      ->condition('type', 'project')
      ->sort('created', 'DESC')
      ->execute();

    $results = $node_storage->loadMultiple($nids);

    $data = [];
    foreach ($results as $result) {

      $target_id= $result->field_customer->getValue()[0]['target_id'];
      $cids = $node_storage->getQuery()
        ->condition('type', 'customer')
        ->condition('nid', $target_id)
        ->execute();

      $customers = $node_storage->loadMultiple($cids)[$target_id];
      $title = $customers->getTitle();

      $building_type = $result->field_project_type->target_id ? Term::Load($result->field_project_type->target_id)->get('name')->value : null;
      $service = $result->field_project_service->target_id ? Term::Load($result->field_project_service->target_id)->get('name')->value : null;
      $sector = $result->field_project_sector->target_id ? Term::Load($result->field_project_sector->target_id)->get('name')->value : null;

      $fileId = $result->field_project_header_image->getValue()[0]['target_id'] ? $result->field_project_header_image->getValue()[0]['target_id'] : null;
      $imgUrl = $this->getImgUrl($fileId);

      $period = $this->timePeriod([$result->field_project_period[0]->value, $result->field_project_period[1]->value ? $result->field_project_period[1]->value : null]);
      $data[] = [
        "nid" => $result->nid->value,
        "url" => $result->toUrl()->toString(),
        "title" => $result->getTitle(),
        "image" => $imgUrl,
        "building" => $building_type,
        "service" => $service,
        "customer" => $title,
        "sector" => $sector,
        'tick' => $result->field_tick->value,
        "period" => $period[1] ? "$period[0]-$period[1]" : $period[0],

      ];

    }
    return $data;

  }

  protected function timePeriod (array $data) {
    $startTimestamp = strtotime($data[0]);
    if($data[1]){
      $endTimestamp = strtotime($data[1]);
    }
    $startYear = date("Y", $startTimestamp);
    if($endTimestamp){
      $endYear = date("Y", $endTimestamp);
    }
    return [$startYear, $endYear];
  }

  protected function getImgUrl ($fid) {
    if(!$fid) return;

    $file = File::load($fid);
    $image_uri = $file->getFileUri();
    $url['original_jpg'] = ImageStyle::load('original')->buildUrl($image_uri);
    $url['original_webp'] = ImageStyle::load('original_webp')->buildUrl($image_uri);
    $url['large_jpg'] = ImageStyle::load('large')->buildUrl($image_uri);
    $url['large_webp'] = ImageStyle::load('large_webp')->buildUrl($image_uri);

    return $url;
  }

}
