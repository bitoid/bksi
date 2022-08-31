<?php

namespace Drupal\projects\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;


class ProjectsCotnroller extends ControllerBase {
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
      ->execute();

    $results = $node_storage->loadMultiple($nids);

    $data = [];

    foreach ($results as $result) {

      $imgUrl = $this->getImgUrl($result->field_project_header_image->getValue()[0]['target_id']);

      $period = $this->timePeriod([$result->field_project_period[0]->value, $result->field_project_period[1]->value]);

      $data[] = [
        "nid" => $result->nid->value,
        "title" => $result->field_project_title->value,
        "image" => $imgUrl,
        "building type" => $result->field_project_type->value,
        "service" => $result->field_project_service->value,
        "client" => $result->field_project_client->value,
        "period" => "$period[0]-$period[1]",
      ];
    }

    return $data;

  }

  protected function timePeriod (array $data) {
    $startTimestamp = strtotime($data[0]);
    $endTimestamp = strtotime($data[1]);

    $startYear = date("Y", $startTimestamp);
    $endYear = date("Y", $endTimestamp);

    return [$startYear, $endYear];
  }

  protected function getImgUrl ($fid) {
    $file = File::load($fid);
    $image_uri = $file->getFileUri();
    $style = ImageStyle::load('thumbnail');
    return $style->buildUrl($image_uri);
  }

}
