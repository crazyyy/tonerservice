<?php get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <header class="entry-header">
      <h1><?php the_title(); ?></h1>
    </header>
    <div class="w-container">
      <?php if (function_exists('easy_breadcrumbs')) easy_breadcrumbs(); ?>
    </div>
    <div class="entry-content flex-cont">
      <div class="flex-cont--item">
        <img src="<?php echo catchFirstImage(); ?>" title="<?php the_title(); ?>" alt="<?php the_title(); ?>" />
      </div>
      <div class="flex-cont--item">
        <div>
          <div>
            <div class="w-col w-col-new w-col-12">
              <div class="price-block-name">Модель принтера: &nbsp;</div>
              <div  class="price-text-block model-print"><?php the_field('model'); ?></div>
            </div>
            <div  class="w-col w-col-new w-col-12">
              <div class="price-block-name">Артикул: &nbsp;</div>
              <div class="price-text-block art_text"><?php the_field('article'); ?></div>
            </div>
            <div  class="w-col w-col-new w-col-12">
              <div class="price-block-name">Новые - C коробкой: &nbsp;</div>
              <div class="price-text-block"><?php the_field('price_new'); ?></div>
            </div>
            <div  class="w-col w-col-new w-col-12">
              <div class="price-block-name">Новые - Без коробки: &nbsp;</div>
              <div class="price-text-block"><?php the_field('price_new_wo_box'); ?></div>
            </div>
            <div  class="w-col w-col-new w-col-12">
              <div class="price-block-name">Б/У - Набор: &nbsp;</div>
              <div class="price-text-block"><?php the_field('price_used'); ?></div>
            </div>
            <div  class="w-col w-col-new w-col-12">
              <div class="price-block-name">Б/У - Без коробки: &nbsp;</div>
              <div class="price-text-block"><?php the_field('price_used_wo_box'); ?></div>
            </div>
            <div  class="w-col w-col-new w-col-12">
              <a class="popup-with-move-anim btnPop" href="/#small-dialog">Продать</a>
            </div>
          </div>
        </div>
      </div>
      <script>
      window.onload = function() {
        var $text_articul = $('.product > .entry-header > h1').text().split(')')[0].split('(')[1];
        $('.art_text').text($text_articul);
      };
      </script>
    </div>

    </article>
  <?php endwhile; endif; ?>

<?php get_footer(); ?>
