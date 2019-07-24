<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */

function ub_render_image_slider_block($attributes){
    extract($attributes);

    $imageArray = json_decode($images, true);
    $captionArray = json_decode($captions, true);

    $gallery = '';
    
    foreach($imageArray as $key => $image){
        $gallery .= '<div>
        <img src="'.$image['url'].'" style="height: '.$sliderHeight.'px;">'.
            ($captionArray[$key]['link'] == '' ? '<span' : '<a href="'.esc_url($captionArray[$key]['link']).'"')
            .' class="ub_image_slider_image_caption">'.$captionArray[$key]['text']
            .($captionArray[$key]['link'] == '' ? '</span>' : '</a>').' </div>';
    }

    return '<div class="ub_image_slider '.esc_attr($className).'" style="min-height: '.
        (25+ (count($imageArray) > 0) ? $sliderHeight : 200 ).'px;">
        <div data-flickity='.json_encode(array('draggable'=>$isDraggable, 'pageDots'=> $showPageDots,
            'wrapAround'=> $wrapsAround, 'autoPlay'=> ($autoplays ? $autoplayDuration * 1000 : $autoplays),
            'adaptiveHeight'=>true )).'>'.$gallery
            .'</div></div>';
}

function ub_register_image_slider_block(){
    if ( function_exists( 'register_block_type' ) ) {
        register_block_type('ub/image-slider', array(
            'attributes' => array(
                'images' => array(
                    'type' => 'string',
                    'default' => '[]'
                ),
                'captions' => array(
                    'type' => 'string',
                    'default' => '[]'
                ),
                'wrapsAround' => array(
                    'type' => 'boolean',
                    'default' => true
                ),
                'isDraggable' => array(
                    'type' => 'boolean',
                    'default' => false
                ),
                'autoplays' => array(
                    'type' => 'boolean',
                    'default' => false
                ),
                'autoplayDuration' => array(
                    'type' => 'number',
                    'default' => 3
                ),
                'sliderHeight' => array(
                    'type' => 'number',
                    'default' => 250
                ),
                'showPageDots' => array(
                    'type' => 'boolean',
                    'default' => true
                )
            ),
            'render_callback' => 'ub_render_image_slider_block'));
    }
}

function ub_image_slider_add_frontend_assets() {
    if ( has_block( 'ub/image-slider' ) ) {
        wp_enqueue_script(
            'ultimate_blocks-image-slider-front-script',
            plugins_url( '/flickity.pkgd.js', __FILE__ ),
            [ 'wp-blocks', 'wp-element', 'wp-components', 'wp-i18n' ],
            Ultimate_Blocks_Constants::plugin_version()
        );
    }
}

add_action('init', 'ub_register_image_slider_block');
add_action( 'wp_enqueue_scripts', 'ub_image_slider_add_frontend_assets' );