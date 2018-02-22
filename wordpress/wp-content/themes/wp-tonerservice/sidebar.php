  <div data-collapse="all" data-animation="over-left" data-duration="400" data-contain="1" class="w-nav w-hidden-main navbar-mobile">
    <div class="w-container nav-mob-cont">
      <nav role="navigation" class="w-nav-menu nav-menu-mob">
        <div class="textwidget">
          <br>
          <br>
          <br>
          <br>
          <form class="search" method="get" action="<?php echo home_url(); ?>" role="search">
            <input class="w-input text-field-form left-search" type="search" name="s" placeholder="Поиск картриджей">
            <input type="hidden" name="post_type" value="product">
          </form>
        </div>
        <div class="menu-%d0%bc%d0%b5%d0%bd%d1%8e-container">
          <?php wpeHeadNav(); ?>
        </div>
        <div class="textwidget">
          <div class="text-address">ООО "ТОНЕР СЕРВИС"
            <br>г. Москва, Большой Волоколамский проезд
            <br> дом 12, корпус 1,
            <br> строение 1
            <br><span class="phone-number">+7 (925) 578-39-44</span>
            <br><span class="phone-number">+7 (916) 043-23-72</span>
            <br><a class="link-email" href="mailto:INFO@TONERSERVICE.RU">info@tonerservice.ru</a></div>
        </div>
      </nav>
      <div class="w-nav-button w-hidden-main nav-mob-button">
        <div class="w-icon-nav-menu w-hidden-main"></div>
      </div>
    </div>
    <div class="w-nav-overlay" data-wf-ignore=""></div>
  </div>

  <div data-collapse="all" data-animation="default" data-duration="400" data-doc-height="1" data-no-scroll="1" class="w-nav w-hidden-medium w-hidden-small w-hidden-tiny navbar">

    <div class="textwidget">
      <a href="<?php echo home_url(); ?>/" class="w-nav-brand brand"><img width="150" src="<?php echo get_template_directory_uri(); ?>/img/logo-300x201.png"></a>
      <p class="logo-text"> Скупка картриджей новых и б/у в Москве</p>
    </div>
    <div class="textwidget">
      <form class="search" method="get" action="<?php echo home_url(); ?>" role="search">
        <input type="search" name="s" class="w-input text-field-form left-search" placeholder="Поиск картриджей">
        <input type="hidden" name="post_type" value="product">
      </form>
    </div>

    <div class="menu-%d0%bc%d0%b5%d0%bd%d1%8e-container">
      <?php wpeHeadNav(); ?>
    </div>

    <div class="execphpwidget">
      <div class="w-form form-call">
        <?php echo do_shortcode('[contact-form-7 id="36" title="Контактная форма"]'); ?>
      </div>
    </div>


    <?php if ( is_active_sidebar('widgetarea1') ) : ?>
      <?php dynamic_sidebar( 'widgetarea1' ); ?>
    <?php endif; ?>

    <div class="w-nav-overlay" data-wf-ignore=""></div>
    <div class="w-nav-overlay" data-wf-ignore=""></div>
  </div>

  <div class="w-hidden-small w-hidden-tiny form-overlay">
    <div class="w-form form-modal">
      <div class="icon-mail"></div>
      <div class="head-text-overlay-form">Заполните форму</div>
      <a href="#" class="w-inline-block btn-close">
        <div data-ix="close-form-overlay" class="close-icon">+</div>
      </a>
      <div role="form" class="wpcf7" id="wpcf7-f118-o2" lang="ru-RU" dir="ltr">
        <div class="screen-reader-response"></div>
        <?php echo do_shortcode('[contact-form-7 id="1129" title="Модалка картриджей"]'); ?>
      </div>
    </div>
  </div>

  <div id="priceBlock" class="w-hidden-small w-hidden-tiny brother-block overlay-style">
    <div class="w-container">
      <div class="close-button"><a href="#" data-ix="close-brother-block" class="multiply-close" style="transition: all 0.1s ease 0s;">+</a></div>
      <div class="price-list" id="priceBrand"></div>
    </div>
    <div data-duration-in="300" data-duration-out="100" class="w-tabs">
      <div class="w-form w-hidden-small w-hidden-tiny form-wrapper-search-toner">
        <form class="search" method="get" action="<?php echo home_url(); ?>" role="search">
          <input type="text" name="stext" class="w-input search-toner-field" placeholder="Поиск">
          <input type="submit" value="Найти" class=" wpcf7-submit w-button submit-button-price">
        </form>
        <br>
        <?php echo do_shortcode('[contact-form-7 id="1130" title="Точно модалка в прайсе"]'); ?>
      </div>
      <div>
        <div class="c-scrollTop">
          <div class="c-scrollTop__inner"></div>
        </div>
      </div>
      <div class="c-psevdoScroll">
        <div class="w-tab-content tabs-content-price" id="loadPrice"></div>
      </div>
    </div>
    <br><a href="#" class="w-button" style="width:35px;" id="upClick">⇑</a>
  </div>
