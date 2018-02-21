<?php /* Template Name: Regions Page */ get_header(); ?>

  <?php if (have_posts()): while (have_posts()) : the_post(); ?>
    <div id="regions" class="w-section section region">
      <div class="w-container">
        <h1><?php the_title(); ?></h1>
        <div class="paragraph">
          <?php the_content(); ?>
        </div>
      </div>

      <div id="dostavka" data-ix="transport-page-appear" class="div-dostavka">
        <div class="icon-holder region"><img width="125" src="http://tonerservice.ru/wp-content/themes/tonerservice/images/sedan-car-front.png" class="icon region-image-icon"></div>
        <h2>рекомендуем&nbsp;для отправки</h2>
        <div class="w-row transport-row">
           <div class="w-col w-col-3 w-col-small-3 w-col-tiny-3 transport-column">
              <a href="http://www.dellin.ru/requests/" target="_blank" data-ix="divider-expand" class="w-inline-block transport-link del-lin"></a><img src="http://tonerservice.ru/wp-content/themes/tonerservice/images/logo1.png" class="transport-pic">
              <div class="transport-name">Деловые линии</div>
              <div data-ix="small-divider" class="w-hidden-small w-hidden-tiny small-divider" style="width: 40px;"></div>
              <div class="about-transport-text">Транспортная компания</div>
              <div class="company">+7 (495)&nbsp;775–55–30</div>
              <a href="http://www.dellin.ru/requests/" target="_blank" class="link-price-transport">Расчитать стоимость</a>
           </div>
           <div class="w-col w-col-3 w-col-small-3 w-col-tiny-3 transport-column">
              <a href="http://pecom.ru/services-are/the-calculation-of-the-cost/" target="_blank" data-ix="divider-expand" class="w-inline-block transport-link pek"></a><img src="http://tonerservice.ru/wp-content/themes/tonerservice/images/logo2.png" class="transport-pic">
              <div class="transport-name">ПЭК</div>
              <div data-ix="small-divider" class="w-hidden-small w-hidden-tiny small-divider"></div>
              <div class="about-transport-text">Транспортная компания</div>
              <div class="company">+7 (495) 660-11-11</div>
              <a href="http://pecom.ru/services-are/the-calculation-of-the-cost/" target="_blank" class="link-price-transport">Расчитать стоимость</a>
           </div>
           <div class="w-col w-col-3 w-col-small-3 w-col-tiny-3 transport-column">
              <a href="https://www.baikalsr.ru/tools/calculator/" rel="nofollow" target="_blank" data-ix="divider-expand" class="w-inline-block transport-link baikal"></a><img src="http://tonerservice.ru/wp-content/themes/tonerservice/images/logo3.png" class="transport-pic">
              <div class="transport-name">Байкал Сервис</div>
              <div data-ix="small-divider" class="w-hidden-small w-hidden-tiny small-divider"></div>
              <div class="about-transport-text">Транспортная компания</div>
              <div class="company">+7 (495) 995-995-2</div>
              <a href="https://www.baikalsr.ru/tools/calculator/" rel="nofollow" target="_blank" class="link-price-transport">Расчитать стоимость</a>
           </div>
           <div class="w-col w-col-3 w-col-small-3 w-col-tiny-3 transport-column">
              <a href="http://www.jde.ru/online/calculator.html" target="_blank" data-ix="divider-expand" class="w-inline-block transport-link jeldor"></a><img src="http://tonerservice.ru/wp-content/themes/tonerservice/images/logo4.png" class="transport-pic">
              <div class="transport-name">ЖелДор</div>
              <div data-ix="small-divider" class="w-hidden-small w-hidden-tiny small-divider"></div>
              <div class="about-transport-text">Транспортная компания</div>
              <div class="company">8-800-1005-505</div>
              <a href="http://www.jde.ru/online/calculator.html" target="_blank" class="link-price-transport">Расчитать стоимость</a>
           </div>
        </div>
      </div>
    </div>
  <?php endwhile; endif; ?>

<?php get_footer(); ?>






