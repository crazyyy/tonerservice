<?php /* Template Name: Bonus Page */ get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>
    <div id="company" class="w-section timeline-container">
      <div class="w-container container-1">
        <h1><?php the_title(); ?></h1>
          <?php the_content(); ?>
      </div>
    </div>
  <?php endwhile; endif; ?>

<?php get_footer(); ?>
