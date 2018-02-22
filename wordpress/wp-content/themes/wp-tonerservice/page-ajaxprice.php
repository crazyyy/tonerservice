<?php /* Template Name: Ajaxprice Page */ ?>
<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

</head>

<body <?php body_class(); ?>>

  <?php $request_id =  intval($_REQUEST['id']); ?>

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
        $args =  array(
          'post_type' => 'product',
          'posts_per_page' => '500',
          'tax_query' => array(
            array (
              'taxonomy' => 'categories',
              'field' => 'term_id',
              'terms' => $request_id
            )
          ),
        );

        $query = new WP_Query( $args );
        while ( $query->have_posts() ) : $query->the_post();
      ?>

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

        <?php endwhile; wp_reset_postdata(); ?>

      </tbody>
      <div id="scroller"></div>
    </table>
</body>
</html>
