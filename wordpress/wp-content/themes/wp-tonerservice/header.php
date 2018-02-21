<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title><?php wp_title( '' ); ?><?php if ( wp_title( '', false ) ) { echo ' :'; } ?> <?php bloginfo( 'name' ); ?></title>

  <link href="http://www.google-analytics.com/" rel="dns-prefetch"><!-- dns prefetch -->

  <!-- icons -->
  <link href="<?php echo get_template_directory_uri(); ?>/favicon.ico" rel="shortcut icon">

  <!--[if lt IE 9]>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/selectivizr/1.0.2/selectivizr-min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
  <!-- css + javascript -->
  <?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>
  <div data-delay="1000" class="w-dropdown w-hidden-main  bubble-out-menu">
    <div class="w-dropdown-toggle bubble-out-toggle">
      <div data-ix="menu-button" class="bubble-out-title">+</div>
      <div data-ix="on-load-display-none" class="close" style="opacity: 0;">X</div>
    </div>
    <nav class="w-dropdown-list bubble-out-list"><a href="<?php echo home_url(); ?>/#contacts" data-ix="bubble-out-top" class="w-dropdown-link link-1">Вызвать курьера</a><a href="tel:+79255783944" rel="nofollow" data-ix="bubble-out-top" class="w-dropdown-link link-1 _2">Позвонить</a></nav>
  </div>
  <div class="w-section w-hidden-main w-hidden-medium section">
    <div class="w-hidden-main w-hidden-medium mobile-logo"><img width="160" src="<?php echo get_template_directory_uri(); ?>/img/5609c7cbe8857b0f12003888_logo-toner.png" alt="<?php wp_title( '' ); ?>"">
      <div class="w-hidden-main w-hidden-medium text-head-mobile">Скупка картриджей</div>
    </div>
  </div>

  <?php get_sidebar(); ?>
