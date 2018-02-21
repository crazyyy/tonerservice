<?php get_header(); ?>

  <article class="page type-page status-publish hentry">

    <?php $term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>


    <header class="entry-header">
      <h1>Скупка картриджей <?php echo $term->name; ?></h1> </header>
    <!-- .entry-header -->
    <div class="w-container">
      <?php if (function_exists('easy_breadcrumbs')) easy_breadcrumbs(); ?>
    </div>
    <div class="entry-content">
      <div class="entry-content__column">
        <div class="preview">
          <?php $image = get_field('image', $term); if( !empty($image) ): ?>
            <img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" />
          <?php endif; ?>
          <div class="preview-text">
            <p>Скупка картриджей <?php echo $term->name; ?></p>
          </div>
        </div>
        <p>&nbsp;</p>
        <?php the_field('description', $term); ?>
      </div>
    </div>
    <!-- .entry-content -->

    <div class="c-psevdoScroll">
      <div class="table--price-list">
        <h2>Прайс-лист <?php echo $term->name; ?></h2>
        <div id="scroller"></div>
        <table class="price-table">
          <thead>
            <tr class="w-row row-price grey-line">
              <th class="w-col w-col-2">
                <div class="price-block-name">Модель принтера</div>
              </th>
              <th class="w-col w-col-2">
                <div class="price-block-name">Артикул</div>
              </th>
              <th class="w-col w-col-2">
                <div class="price-block-name">Новые - C коробкой</div>
              </th>
              <th class="w-col w-col-2">
                <div class="price-block-name">Новые - Без коробки</div>
              </th>
              <th class="w-col w-col-2">
                <div class="price-block-name">Б/У - Набор</div>
              </th>
              <th class="w-col w-col-2">
                <div class="price-block-name">Б/У - Без коробки</div>
              </th>
            </tr>
          </thead>
          <tbody>

            <?php
              $args = array(
                  'post_type' => 'product',
                  'posts_per_page' => '500',
                  'categories' => $term->slug
              );
              $query = new WP_Query( $args );
              while ( $query->have_posts() ) : $query->the_post();
            ?>
              <tr class="w-row row-price">
                <td class="w-col w-col-2">
                  <div class="price-text-block model-print"><?php the_title(); ?></div>
                </td>
                <td class="w-col w-col-2">
                  <div class="price-text-block"><a href="<?php the_permalink(); ?>"><?php the_field('article'); ?></a></div>
                </td>
                <td class="w-col w-col-2">
                  <div class="price-text-block"><?php if (get_field('price_new')) { the_field('price_new'); echo ' руб.'; } ?></div>
                </td>
                <td class="w-col w-col-2">
                  <div class="price-text-block"><?php if (get_field('price_new_wo_box')) { the_field('price_new_wo_box'); echo ' руб.'; } ?></div>
                </td>
                <td class="w-col w-col-2">
                  <div class="price-text-block"><?php if (get_field('price_used')) { the_field('price_used'); echo ' руб.'; } ?></div>
                </td>
                <td class="w-col w-col-2">
                  <div class="price-text-block"><?php if (get_field('price_used_wo_box')) { the_field('price_used_wo_box'); echo ' руб.'; } ?></div>
                </td>
              </tr>
            <?php endwhile; wp_reset_postdata(); ?>
          </tbody>
        </table>
      </div>
    </div>
  </article>

<?php get_footer(); ?>
