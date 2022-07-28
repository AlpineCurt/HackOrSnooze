"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  getAndShowStoriesOnStart();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navSubmit.show();
  $navFavorites.show();
  $navMyStories.show();
}

/* When a user clicks the submit link */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navSubmit.on('click', navSubmitClick);

/* When a user clicks my stories */

function navMyStoriesClick(evt) {
  console.debug('navUsernameClick');
  storyList = new StoryList(currentUser.ownStories);
  hidePageComponents();
  putStoriesOnPage();
}

$navMyStories.on('click', navMyStoriesClick);

/* When a user clicks on 'favorites' */
function showFavoriteStories() {
  storyList = new StoryList(currentUser.favorites);
  hidePageComponents();
  putStoriesOnPage();
}

$navFavorites.on('click', showFavoriteStories);