<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */
function ub_content_toggle_add_frontend_assets() {
    if ( has_block( 'ub/content-toggle' ) or has_block('ub/content-toggle-panel') ) {
        wp_enqueue_script(
            'ultimate_blocks-content-toggle-front-script',
            plugins_url( 'content-toggle/front.js', dirname( __FILE__ ) ),
            array( 'jquery' ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

function ub_render_content_toggle_block($attributes, $content){
    return '<div>'.$content.'</div>';
}

function ub_render_content_toggle_panel_block($attributes, $content){
    $classNamePrefix = 'wp-block-ub-content-toggle';
    $theme = $attributes['theme'];
    $collapsed = $attributes['collapsed'];

    return '<div style="border-color: '.$theme.';" class="'.$classNamePrefix.'-accordion">
                <div class="'.$classNamePrefix.'-accordion-title-wrap" style="background-color: '.$theme.';">
                    <span class="'.$classNamePrefix.'-accordion-title" style="color: '.$attributes['titleColor'].';">'.$attributes['panelTitle'].'</span>
                    <span class="'.$classNamePrefix.'-accordion-state-indicator dashicons dashicons-arrow-right-alt2 '.
                    ($collapsed ? '' : 'open').'"></span>
                </div><div class="'.$classNamePrefix.'-accordion-content-wrap"
                style="height: '.($collapsed ? 0 : '').';
                        padding-top: '.($collapsed ? 0 : '').';
                        padding-bottom: '.($collapsed ? 0 : '').';">'.
                $content
                .'</div></div>' ;
}

function ub_register_content_toggle_panel_block() {
	if ( function_exists( 'register_block_type' ) ) {
		register_block_type( 'ub/content-toggle-panel', array(
            'attributes' => array(
                'theme' => array(
                    'type' => 'string',
                    'default' => '#f63d3d'
                ),
                'collapsed' => array(
                    'type' => 'boolean',
                    'default' => false
                ),
                'titleColor' => array(
                    'type' => 'string',
                    'default' => '#ffffff'
                ),
                'panelTitle' => array(
                    'type' => 'string',
                    'default' => ''
                )
            ),
			'render_callback' => 'ub_render_content_toggle_panel_block'));
	}
}

function ub_register_content_toggle_block() {
	if ( function_exists( 'register_block_type' ) ) {
        register_block_type( 'ub/content-toggle',
        array('render_callback' => 'ub_render_content_toggle_block'));
	}
}

add_action('init', 'ub_register_content_toggle_block');

add_action('init', 'ub_register_content_toggle_panel_block');

add_action( 'wp_enqueue_scripts', 'ub_content_toggle_add_frontend_assets' );
