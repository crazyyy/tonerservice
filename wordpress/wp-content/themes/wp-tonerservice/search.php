<?php get_header(); ?>

  <header class="entry-header">
    <h1><?php echo sprintf( __( '%s Результатов поиска "', 'wpeasy' ), $wp_query->found_posts ); echo get_search_query(); ?>"</h1>
  </header>

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

      <?php if ( have_posts() ) { ?>
        <?php while ( have_posts() ) { the_post(); ?>

        <tr class="w-row row-price">
          <td class="w-col w-col-2">
            <div  class="price-text-block model-print"><?php the_title(); ?></div>
          </td>
          <td  class="w-col w-col-2">
            <div class="price-text-block"><a href="<?php the_permalink(); ?>"><?php the_field('article'); ?></a></div>
          </td>
          <td  class="w-col w-col-2">
            <div class="price-text-block"><?php if (get_field('price_new')) { the_field('price_new'); echo ' руб.'; } ?></div>
          </td>
          <td  class="w-col w-col-2">
            <div class="price-text-block"><?php if (get_field('price_new_wo_box')) { the_field('price_new_wo_box'); echo ' руб.'; } ?></div>
          </td>
          <td  class="w-col w-col-2">
            <div class="price-text-block"><?php if (get_field('price_used')) { the_field('price_used'); echo ' руб.'; } ?></div>
          </td>
          <td  class="w-col w-col-2">
            <div class="price-text-block"><?php if (get_field('price_used_wo_box')) { the_field('price_used_wo_box'); echo ' руб.'; } ?></div>
          </td>
        </tr>

        <?php } ?>
      <?php } ?>

    </tbody>
    <div id="scroller"></div>
  </table>

<?php get_footer(); ?>
