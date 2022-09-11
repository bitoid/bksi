<?php

namespace Drupal\projects\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Ged Currency Chart Block' Block.
 *
 * @Block(
 *   id = "projects_block",
 *   admin_label = @Translation("Projects Block"),
 *   category = @Translation("Projects"),
 * )
 */

class ProjectsBlock extends BlockBase
{
    public function build()
    {
        $sector = $this->getTerms('sector');
        $building = $this->getTerms('building');
        $service = $this->getTerms('service');

        return [
            '#theme' => 'projects',
            '#sector' => $sector,
            '#building' => $building,
            '#service' => $service,
            '#attached' => [
                'library' => [
                    'projects/projects_block_lib',
                ],
            ],
        ];
    }

    public function getTerms($vocabulary)
    {
        $query = \Drupal::entityQuery('taxonomy_term');
        $query->condition('vid', "$vocabulary");
        $tids = $query->execute();
        $terms = \Drupal\taxonomy\Entity\Term::loadMultiple($tids);
        $termsArr = [];
        foreach ($terms as $term) {
            $termsArr[] = [
                'name' => $term->name->value
            ];
        }
        return $termsArr;
    }
}
