<?php

namespace Drupal\projects\Controller;
use Drupal\Core\Controller\ControllerBase;
//use Drupal\Core\Entity\EntityTypeInterface;
//use Drupal\Core\Entity\EntityTypeManagerInterface;
//use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;


class ProjectsCotnroller extends ControllerBase {

  public function data () {
    return new JsonResponse([
      'data' => $this->getProjectsData(),
      'method' => 'GET',
    ]);
  }

  public function getProjectsData () {
    $fake_data = [
      [
        "nid" => "node id",
        "title" => "Residential Complex",
        "image" => "img_resident.jpg",
        "building type" => "Residential",
        "service" => "Digital",
        "client" => "Dr. Ing. h.c.F Porsche AG",
        "period" => '2013-2015',
      ],
      [
        "nid" => "node id",
        "title" => "Residential Complex",
        "image" => "image.jpg",
        "building type" => "Residential",
        "service" => "Digital",
        "client" => "Dr. Ing. h.c.F Porsche AG",
        "period" => '2013-2015',
      ],
    ];

    return $fake_data;

  }
}
