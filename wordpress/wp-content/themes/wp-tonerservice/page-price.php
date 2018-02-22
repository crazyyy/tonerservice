<?php /* Template Name: Price Page */ get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>

    <div id="price" class="w-hidden-small w-hidden-tiny w-section section pricelist">
      <div class="div-price">
        <div class="hwH1"><?php the_title(); ?></div>

        <div class="div-brand">

        <?php
          $terms = get_terms( array(
            'taxonomy' => 'categories',
            'hide_empty' => false,
          ) );

          foreach ($terms as $term) { ?>


          <a
            href="#"
            title="<?php echo $term->name; ?>"
            id="brand<?php echo $term->term_id; ?>"
            onclick="jQuery('#priceBrand').html('Прайс лист <?php echo $term->name; ?>'); jQuery('#loadPrice').load('/ajaxprice?id=<?php echo $term->term_id; ?>',{},function(){ initBtn(); })"
            style="transition: all 0.1s ease 0s; background-image: url(<?php $logo = get_field('logo', $term); echo $logo['url']; ?>);"
            data-ix="open-brother-block"
            class="w-inline-block link-brand-block brand<?php echo $term->term_id; ?>"

            >
          </a>
          <script>
          jQuery('#brand<?php echo $term->term_id; ?>').hover(function() {
            jQuery(this).css("background-image", "url(<?php $logo_white = get_field('logo_white', $term); echo $logo_white['url']; ?>)");
          }).mouseleave(function() {
            jQuery(this).css("background-image", "url(<?php $logo = get_field('logo', $term); echo $logo['url']; ?>)");
          });
          </script>


          <?php } ?>


          <a href="#" data-ix="open-form" class="w-inline-block w-hidden-medium w-hidden-small w-hidden-tiny link-brand-block call" style="transition: all 0.1s ease 0s;"></a>
        </div>

        <div class="shadow">
          <img src="<?php echo get_template_directory_uri(); ?>/img/5609c7cbe8857b0f12003819_536ac99047f06b8f27988640_shadow.png" class="shadow-section" style="transition: transform 500ms; transform: translateX(0px) translateY(0px) translateZ(0px);">
        </div>
      </div>
    </div>

  <?php endwhile; endif; ?>

<?php get_footer(); ?>
