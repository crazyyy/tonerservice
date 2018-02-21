<?php /* Template Name: FAQ Page */ get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>
    <div id="questions" class="w-section section questions">
      <p class="main-h1"><?php the_title(); ?></p>
      <div class="w-container">

        <?php if( have_rows('faq') ): while ( have_rows('faq') ) : the_row(); ?>

          <div class="w-clearfix">
            <a href="#" data-ix="question" class="w-inline-block question-block">
              <div class="text-pane">
                <div class="question_title"><?php the_sub_field('question'); ?></div>
              </div>
            </a>
            <a href="#" data-ix="close-answer" class="w-hidden-small w-hidden-tiny w-inline-block close-button-questions">
              <div class="close-button-text">+</div>
            </a>
            <div class="answer-block">
              <p class="solution-paragraph"></p>
              <?php the_sub_field('answer'); ?>
              <p></p>

            </div>
          </div>

        <?php endwhile; endif; ?>

      </div>

      <div class="grey-line-arrow">
        <div class="arrow-contacts work-con-arrow white-arrow"></div>
        <div class="arrow-contacts company-arrow white"><img src="<?php echo get_template_directory_uri(); ?>/img/arrow2.png"></div>
      </div>
    </div>
  <?php endwhile; endif; ?>

<?php get_footer(); ?>
