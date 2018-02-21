<?php get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <header class="entry-header">
      <h1><?php the_title(); ?></h1>
    </header>
    <!-- .entry-header -->
    <div class="entry-content w-clearfix">
     <?php the_content(); ?>
    </div>
    <!-- .entry-content -->

    </article>
  <?php endwhile; endif; ?>

<?php get_footer(); ?>
