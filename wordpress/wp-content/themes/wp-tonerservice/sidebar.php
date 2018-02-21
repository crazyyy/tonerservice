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
            <br><a class="link-email" href="mailto:INFO@TONERSERVICE.RU?subject=%D0%92%D1%8B%D0%B7%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BA%D1%83%D1%80%D1%8C%D0%B5%D1%80%D0%B0">info@tonerservice.ru</a></div>
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
      <a href="http://tonerservice.ru/" class="w-nav-brand brand"><img width="150" src="<?php echo get_template_directory_uri(); ?>/img/logo-300x201.png"></a>
      <p class="logo-text"> Скупка картриджей новых и б/у в Москве</p>
    </div>
    <div class="textwidget">
      <form method="get" action="http://tonerservice.ru/search">
        <input type="text" class="w-input text-field-form left-search" name="stext" placeholder="Поиск картриджей">
      </form>
    </div>

    <div class="menu-%d0%bc%d0%b5%d0%bd%d1%8e-container">
      <?php wpeHeadNav(); ?>
    </div>

    <div class="execphpwidget">
      <div class="w-form form-call">
        <div role="form" class="wpcf7" id="wpcf7-f31-o1" lang="ru-RU" dir="ltr">
          <div class="screen-reader-response"></div>
          <form action="/#wpcf7-f31-o1" method="post" class="wpcf7-form" novalidate="novalidate" onclick="yaCounter32777385.reachGoal(&#39;vyzov&#39;); return true;">
            <p>
              <label for="node-4" class="name-form">Вызвать курьера сейчас:&nbsp;</label>
              <span class="wpcf7-form-control-wrap text-815"><input type="text" name="text-815" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required w-input text-field-form" id="node-4" aria-required="true" aria-invalid="false" placeholder="Введите ваше имя"></span>
              <span class="wpcf7-form-control-wrap text-816"><input type="text" name="text-816" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required w-input text-field-form" id="node-5" aria-required="true" aria-invalid="false" placeholder="Введите номер телефона"></span></p>
            <div class="soglasie">
              <input type="checkbox" name="soglasie_check_delivery" id="s-checkbox_delivery" onclick="jQuery(&#39;#but-delivery&#39;).toggleClass(&#39;dis&#39;);">
              <label for="s-checkbox_delivery">Отправляя персональные данные из данной формы, я даю <a href="http://tonerservice.ru/agreement/" target="_blank">согласие на обработку персональных данных</a></label>
            </div>
            <p>
              <input type="submit" value="Вызвать (бесплатно)" class="wpcf7-form-control wpcf7-submit w-button submit-button dis" id="but-delivery"><img class="ajax-loader" src="<?php echo get_template_directory_uri(); ?>/img/ajax-loader.gif" alt="Отправка..." style="visibility: hidden;"></p>
            <div class="wpcf7-response-output wpcf7-display-none"></div>
          </form>
        </div>
      </div>
    </div>


    <?php if ( is_active_sidebar('widgetarea1') ) : ?>
      <?php dynamic_sidebar( 'widgetarea1' ); ?>
    <?php else : ?>

      <!-- If you want display static widget content - write code here
      RU: Здесь код вывода того, что необходимо для статического контента виджетов -->

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
        <form action="/#wpcf7-f118-o2" method="post" class="wpcf7-form" novalidate="novalidate" onclick="yaCounter32777385.reachGoal(&#39;vyzov&#39;); return true;">
          <p><span class="wpcf7-form-control-wrap text-355"><input type="text" name="text-355" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required w-input text-field-form-overlay" aria-required="true" aria-invalid="false" placeholder="Введите ваше имя"></span>
            <br>
            <span class="wpcf7-form-control-wrap text-356"><input type="text" name="text-356" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required w-input text-field-form-overlay" aria-required="true" aria-invalid="false" placeholder="Введите номер телефона"></span>
            <br>
            <span class="wpcf7-form-control-wrap textarea-913"><textarea name="textarea-913" cols="40" rows="2" class="wpcf7-form-control wpcf7-textarea w-input text-field-form-overlay model-cartr" aria-invalid="false" placeholder="Введите модели картриджей (необязательно)"></textarea></span></p>
          <div class="soglasie">
            <input type="checkbox" name="soglasie_check_modal" id="s-checkbox_modal" onclick="jQuery(&#39;#but-modal&#39;).toggleClass(&#39;dis&#39;);">
            <label for="s-checkbox_modal">Отправляя персональные данные из данной формы, я даю <a href="http://tonerservice.ru/agreement/" target="_blank">согласие на обработку персональных данных</a></label>
          </div>
          <p>
            <input type="submit" value="Отправить заявку" class="wpcf7-form-control wpcf7-submit w-button dis" id="but-modal"><img class="ajax-loader" src="<?php echo get_template_directory_uri(); ?>/img/ajax-loader.gif" alt="Отправка..." style="visibility: hidden;"></p>
          <div class="wpcf7-response-output wpcf7-display-none"></div>
        </form>
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
        <form method="get" action="http://tonerservice.ru/search/">
          <input type="text" name="stext" class="w-input search-toner-field" placeholder="Поиск">
          <input type="submit" value="Найти" class="wpcf7-form-control wpcf7-submit w-button submit-button-price">
        </form>
        <br>
        <label for="node-9" class="text-search-toner">Не нашли свой картридж? Заполните форму и мы вам перезвоним!</label>
        <div role="form" class="wpcf7" id="wpcf7-f113-o3" lang="ru-RU" dir="ltr">
          <div class="screen-reader-response"></div>
          <form action="/#wpcf7-f113-o3" method="post" class="wpcf7-form" novalidate="novalidate">
            <p><span class="wpcf7-form-control-wrap menu-997"><select name="menu-997" class="wpcf7-form-control wpcf7-select wpcf7-validates-as-required w-select search-toner-field" aria-required="true" aria-invalid="false"><option value="Выберите принтер">Выберите принтер</option><option value="Brother">Brother</option><option value="Canon">Canon</option><option value="HP">HP</option><option value="Kyocera">Kyocera</option><option value="Panasonic">Panasonic</option><option value="Samsung">Samsung</option><option value="Xerox">Xerox</option></select></span>
              <span class="wpcf7-form-control-wrap text-6"><input type="text" name="text-6" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required w-input search-toner-field" aria-required="true" aria-invalid="false" placeholder="Введите модель картриджа"></span>
              <span class="wpcf7-form-control-wrap text-7"><input type="text" name="text-7" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required w-input search-toner-field" aria-required="true" aria-invalid="false" placeholder="Номер телефона"></span>
              <input type="submit" value="Отправить" class="wpcf7-form-control wpcf7-submit w-button submit-button-price dis" id="but-price"><img class="ajax-loader" src="<?php echo get_template_directory_uri(); ?>/img/ajax-loader.gif" alt="Отправка..." style="visibility: hidden;"></p>
            <div class="soglasie">
              <input type="checkbox" name="soglasie_check_price" id="s-checkbox_price" onclick="jQuery(&#39;#but-price&#39;).toggleClass(&#39;dis&#39;);">
              <label for="s-checkbox_price">Отправляя персональные данные из данной формы, я даю <a href="http://tonerservice.ru/agreement/" target="_blank">согласие на обработку персональных данных</a></label>
            </div>
          </form>
        </div>
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
