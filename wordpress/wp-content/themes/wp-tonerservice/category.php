<?php get_header(); ?>

  <header class="entry-header">
    <h1><?php the_category(', '); ?></h1>
  </header>

  <article class="page-template-template-skupka">

    <?php get_template_part('loop'); ?>

    <?php get_template_part('pagination'); ?>

  </article>

<?php get_footer(); ?>
