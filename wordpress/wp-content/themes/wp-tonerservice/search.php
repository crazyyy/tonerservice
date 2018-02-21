<?php get_header(); ?>

  <header class="entry-header">
    <h1><?php echo sprintf( __( '%s Search Results for ', 'wpeasy' ), $wp_query->found_posts ); echo get_search_query(); ?></h1>
  </header>

  <article class="page-template-template-skupka">

    <?php get_template_part('loop'); ?>

    <?php get_template_part('pagination'); ?>

  </article>

<?php get_footer(); ?>
