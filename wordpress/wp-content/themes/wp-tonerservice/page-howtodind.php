<?php /* Template Name: How To find us Page */ get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <header class="entry-header">
      <h1><?php the_title(); ?></h1>
    </header>
    <!-- .entry-header -->
    <div class="entry-content w-clearfix">
     <?php the_content(); ?>

      <p style="text-align:center">
        <a href="<?php echo get_template_directory_uri(); ?>/img/shema.jpg" data-fancybox="images"><img src="<?php echo get_template_directory_uri(); ?>/img/shema.jpg" style="width:65%;"></a>
      </p>
      <h2>Схема проезда от метро Октябрьское Поле</h2>

      <div class="shem-slider-conteiner">
        <div class="shem-slider">
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_1.jpg">
            <p></p>
            <p>Первый вагон из центра → Из стеклянных дверей направо → налево на лестницу вверх.</p>
            <p>Следуйте прямо вдоль ул. Маршала Бирюзова до перекрестка → на перекрестке прямо по пешеходному переходу.</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_2.jpg">
            <p></p>
            <p>Далее прямо до следующего перекрестка с ул. Маршала Конева.
            </p>
            <p>На перекрестке сворачивайте направо не переходя дорогу.
            </p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_3.jpg">
            <p></p>
            <p>Следуйте прямо по ул. Маршала Конева, пересекая ул. Маршала Рыбалко, до указателя: «Усадьба Банная».</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_4.jpg">
            <p></p>
            <p>Переходите дорогу по пешеходному переходу пересекая, далее сворачиваете направо в сторону «Усадьба Банная».</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_5.jpg">
            <p></p>
            <p>Следуйте прямо вдоль тротуара жилого дома.</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_6.jpg">
            <p></p>
            <p>Сразу за этим домом сворачивайте во двор. (Фото 1)</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_7.jpg">
            <p></p>
            <p>Сразу за этим домом сворачивайте во двор. (Фото 2)</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_8.jpg">
            <p></p>
            <p>Обогнув этот дом, возле ближайшего подъезда сворачивайте направо в сторону арки. (Фото 1)</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_9.jpg">
            <p></p>
            <p>Обогнув этот дом, возле ближайшего подъезда сворачивайте направо в сторону арки. (Фото 2)</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_10.jpg">
            <p></p>
            <p>После арки сворачивайте налево и следуйте прямо до спорт-бара «Азарт». (Фото 1)</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_11.jpg">
            <p></p>
            <p>После арки сворачивайте налево и следуйте прямо до спорт-бара «Азарт». (Фото 2)</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_12.jpg">
            <p></p>
            <p>Справа от спорт-бара вход через калитку.</p>
            <p></p>
          </div>
          <div class="item">
            <img src="<?php echo get_template_directory_uri(); ?>/img/slide_13.jpg">
            <p></p>
            <p>Вход в бизнес-центр через единственное крыльцо. На охране скажите, что пришли в «Тонер Сервис» по поводу картриджей.</p>
            <p></p>
          </div>
        </div>
      </div>


    </div>
    <!-- .entry-content -->

    </article>
  <?php endwhile; endif; ?>

<?php get_footer(); ?>
