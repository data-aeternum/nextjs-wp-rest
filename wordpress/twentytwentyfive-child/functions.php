<?php
/**
 * Twenty Twenty-Five Child — functions.php
 *
 * Step 1: load the parent theme stylesheet.
 */
add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );
function enqueue_parent_styles() {
	wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
}

/**
 * Step 2: register the custom REST API routes.
 *
 *   /wp-json/twentytwentyfive-child/v1/latest-posts/<category-id>  -> posts in one category
 *   /wp-json/twentytwentyfive-child/v1/latest-posts                -> all published posts
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'twentytwentyfive-child/v1', 'latest-posts/(?P<category_id>\d+)', array(
		'methods'             => 'GET',
		'callback'            => 'get_latest_posts_by_category',
		'permission_callback' => '__return_true',
		'args'                => array(
			'category_id' => array(
				'validate_callback' => function ( $param ) {
					return is_numeric( $param );
				},
				'sanitize_callback' => 'absint',
			),
		),
	) );

	register_rest_route( 'twentytwentyfive-child/v1', 'latest-posts', array(
		'methods'             => 'GET',
		'callback'            => 'get_latest_posts_by_category',
		'permission_callback' => '__return_true',
	) );
} );

/**
 * Step 3: the callback. Returns an array of posts as JSON, or a 404 error
 * when the category has no posts.
 */
function get_latest_posts_by_category( $request ) {

	$args = array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => 20,
		'orderby'        => 'date',
		'order'          => 'DESC',
	);

	if ( ! empty( $request['category_id'] ) ) {
		$args['category'] = $request['category_id'];
	}

	$posts = get_posts( $args );

	if ( empty( $posts ) ) {
		return new WP_Error( 'empty_category', 'There are no posts to display', array( 'status' => 404 ) );
	}

	// Add a few derived fields the Next.js app uses (plain-text excerpt, author name, permalink).
	$data = array();
	foreach ( $posts as $post ) {
		$item               = (array) $post;
		$item['author_name'] = get_the_author_meta( 'display_name', $post->post_author );
		$item['excerpt']     = wp_trim_words( wp_strip_all_tags( $post->post_content ), 30 );
		$item['permalink']   = get_permalink( $post );
		$item['categories']  = wp_get_post_categories( $post->ID, array( 'fields' => 'names' ) );
		$data[]              = $item;
	}

	$response = new WP_REST_Response( $data );
	$response->set_status( 200 );

	return $response;
}
