<?php if (have_posts()): while (have_posts()) : the_post(); ?>
  <div id="post-<?php the_ID(); ?>" <?php post_class('looper'); ?>>
    <h2><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h2>
    <div class="date"><?php the_time('j F Y'); ?></div>
    <?php wpeExcerpt('wpeExcerpt40'); ?>
  </div><!-- /looper -->
<?php endwhile; endif; ?>
