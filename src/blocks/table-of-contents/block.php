<?php

function ub_render_table_of_contents_block($attributes){
    $linkArray = json_decode($attributes['links'], true);
    $allowedHeaders = $attributes['allowedHeaders'];
    $filteredHeaders = array_values(array_filter($linkArray, function ($header) use ($allowedHeaders){
        return $allowedHeaders[$header['level'] - 1];
    }));

    $listStyle = $attributes['listStyle'];

    $sortedHeaders = [];

    foreach($filteredHeaders as $elem){
        $last = count($sortedHeaders) - 1;
        if (count($sortedHeaders) == 0 || $sortedHeaders[$last][0]['level'] < $elem['level']) {
            array_push($sortedHeaders, [$elem]);
        }
        else if ($sortedHeaders[$last][0]['level'] == $elem['level']){
            array_push($sortedHeaders[$last], $elem);
        }
        else{
            while($sortedHeaders[$last][0]['level'] > $elem['level']){
                array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
                $last = count($sortedHeaders) - 1;
            }
            if($sortedHeaders[$last][0]['level'] == $elem['level']){
                array_push($sortedHeaders[$last], $elem);
            }
        }
    }

    while(count($sortedHeaders) > 1 &&
        $sortedHeaders[count($sortedHeaders) - 1][0] > $sortedHeaders[count($sortedHeaders) - 2][0]){
        array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
    }

    $sortedHeaders = $sortedHeaders[0];

    $listItems = '';

    if (!function_exists('ub_makeListItem')) {
        function ub_makeListItem($item, $listStyle){
            static $outputString = '';
            if (array_key_exists("level", $item)){
                $anchor = $item["anchor"];
                $content = $item["content"];
                $outputString .= '<li><a href="#'.$anchor.'">'.$content.'</a></li>';
            }
            else{
                $openingTag = $listStyle == 'numbered' ? '<ol>' : '<ul'.
                    ($listStyle == 'plain' ? ' style="list-style: \'none\';"' : '').'>';

                $outputString = substr_replace($outputString, $openingTag,
                    strrpos($outputString, '</li>'), strlen('</li>'));

                forEach($item as $subItem){
                    ub_makeListItem($subItem, $listStyle);
                }
                $outputString .= ($listStyle == 'numbered' ? '</ol>' : '</ul>') . '</li>';
            }
            return $outputString;
        }
    }

    foreach($sortedHeaders as $item){
        $listItems = ub_makeListItem($item, $listStyle);
    }

    return '<div class="ub_table-of-contents" data-showtext="'.__('show').'" data-hidetext="'.__('hide').'">'.
                (strlen($attributes['title']) > 0 ? ('<div class="ub_table-of-contents-header">
                    <div class="ub_table-of-contents-title">'.
                        $attributes['title']
                    .'</div>'.
                    ($attributes['allowToCHiding'] ?
                    '<div id="ub_table-of-contents-header-toggle">
                        <div id="ub_table-of-contents-toggle">
                            [<a class="ub_table-of-contents-toggle-link" href="#">'.
                            __($attributes['showList'] ? 'hide' : 'show')
                            .'</a>]
                        </div>
                    </div>' :'')
                .'</div>') : '')
                .'<div class="ub_table-of-contents-container ub_table-of-contents-' .$attributes['numColumns']. '-column">'.
                ($listStyle == 'numbered' ? '<ol>' : '<ul'.
                    ($listStyle == 'plain' ? ' style="list-style: \'none\';"' : '').'>')
                . $listItems .
                ($listStyle == 'numbered' ? '</ol>' : '</ul>')
                .'</div>
            </div>';
}

function ub_register_table_of_contents_block() {
	if( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/table-of-contents', array(
            'attributes' => array(
                'title' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'allowedHeaders' => array(
                    'type' => 'array',
                    'default' => array_fill(0, 6, true)
                ),
                'links' => array(
                    'type' => 'string',
                    'default' => ''
                ),
                'allowToCHiding' => array(
                    'type' => 'boolean',
                    'default' => false
                ),
                'showList' => array(
                    'type' => 'boolean',
                    'default' => true
                ),
                'numColumns' => array(
                    'type' => 'number',
                    'default' => 1
                ),
                'listStyle' => array(
                    'type' => 'string',
                    'default' => 'bulleted'
                )
            ),
            'render_callback' => 'ub_render_table_of_contents_block'));
    }
}

function ub_table_of_contents_add_frontend_assets() {
    if ( has_block( 'ub/table-of-contents' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-table-of-contents-front-script',
            plugins_url( 'table-of-contents/front.js', dirname( __FILE__ ) ),
            array( 'jquery' ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

add_action('init', 'ub_register_table_of_contents_block');
add_action( 'wp_enqueue_scripts', 'ub_table_of_contents_add_frontend_assets' );