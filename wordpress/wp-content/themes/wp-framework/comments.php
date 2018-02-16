<div class="comments">

  <?php if (post_password_required()) : ?>
    <p><?php _e( 'Post is password protected. Enter the password to view any comments.', 'wpeasy' ); ?></p>
  <?php return; endif; ?>

  <?php if (have_comments()) : ?>

    <h5><?php comments_number(); ?></h5>
    <ul>
      <?php wp_list_comments('type=comment&callback=html5blankcomments'); // Custom callback in functions.php ?>
    </ul>

  <?php elseif ( ! comments_open() && ! is_page() && post_type_supports( get_post_type(), 'comments' ) ) : ?>

    <p><?php _e( 'Comments are closed here.', 'wpeasy' ); ?></p>

  <?php endif; ?>

  <?php
    $comment_args = array( 'title_reply'=>'Got Something To Say:',
      'fields' => apply_filters( 'comment_form_default_fields', array(
        'author' => '<p class="comment-form-author">' . '<label for="author">' . __( 'Your Good Name' ) . '</label> ' . ( $req ? '<span>*</span>' : '' ) .'<input id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . ' /></p>',

        'email'  => '<p class="comment-form-email">' . '<label for="email">' . __( 'Your Email Please' ) . '</label> ' . ( $req ? '<span>*</span>' : '' ) . '<input id="email" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) . '" size="30"' . $aria_req . ' />'.'</p>',

        'url'    => '' ) ),

      'comment_field' => '<p>' . '<label for="comment">' . __( 'Let us know what you have to say:' ) . '</label>' . '<textarea id="comment" name="comment" cols="45" rows="8" aria-required="true"></textarea>' . '</p>',

      'comment_notes_after' => '',
    );

    comment_form($comment_args);

  ?>

</div><!-- comments -->
