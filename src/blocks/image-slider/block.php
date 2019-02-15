<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */
function ub_image_slider_add_frontend_assets() {
    wp_enqueue_script(
        'ultimate_blocks-image-slider-front-script',
        plugins_url( '/flickity.pkgd.js', __FILE__ ),
        [ 'wp-blocks', 'wp-element', 'wp-components', 'wp-i18n' ],
        filemtime( plugin_dir_path( __FILE__ ) . 'flickity.pkgd.js' ) 
    );
}

add_action( 'wp_enqueue_scripts', 'ub_image_slider_add_frontend_assets' );