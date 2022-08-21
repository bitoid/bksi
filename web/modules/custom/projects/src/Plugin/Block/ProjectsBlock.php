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
        return [
            '#theme' => 'projects',
            '#attached' => [
                'library' => [
                    'projects/projects_block_lib',
                ],
            ],
        ];
    }
}
