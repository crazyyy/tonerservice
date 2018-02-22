<?php get_header(); ?>

  <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <header class="entry-header">
      <h1><?php _e( 'Page not found', 'wpeasy' ); ?></h1>
    </header>
    <!-- .entry-header -->
    <div class="entry-content w-clearfix">
     <h2><a href="<?php echo home_url(); ?>"><?php _e( 'Return home?', 'wpeasy' ); ?></a></h2>
    </div>
    <!-- .entry-content -->

  </article>

<?php get_footer(); ?>
