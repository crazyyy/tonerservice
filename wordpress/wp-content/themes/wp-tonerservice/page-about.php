<?php /* Template Name: About Page */ get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>
    <div id="company" class="w-section section company">
      <div class="w-container container-1">
        <h1><?php the_title(); ?></h1>
        <div class="paragraph company-text">
          <?php the_content(); ?>
        </div>
      </div>

      <div class="grey-line-arrow">
        <div class="arrow-contacts work-con-arrow white-arrow"></div>
        <div class="arrow-contacts company-arrow white"><img src="<?php echo get_template_directory_uri(); ?>/img/arrow2.png"></div>
      </div>
    </div>
  <?php endwhile; endif; ?>

<?php get_footer(); ?>
