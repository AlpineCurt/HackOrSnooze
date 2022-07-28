"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);
  const showTrash = currentUser.ownStories.some(s => s.storyId === story.storyId);

  return $(`
      <li id="${story.storyId}">
      ${showTrash ? trashHTML() : ""}
      ${showStar ? starHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/* generates HTML for star icon */
function starHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  return `
    <span class="star">
      <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
    </span>
  `;
}

/* Generate HTML for trashcan icon */
function trashHTML() {
  return `
  <span class="trashCan">
    <i class="fas fa-trash-alt"></i>
  </span>
  `;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  let url = $("#story-url").val();
  
  // The API seems to reject everything without http in the url
  if (!url.includes("http")) {
    url = 'http://' + url;
  }

  const newStory = await StoryList.addStory(currentUser, {
    title: title,
    author: author,
    url: url
  });

  await axios({
    url: `${BASE_URL}/stories`,
    method: "POST",
    data: {
      token: localStorage.getItem("token"),
      story: {
        author: author,
        title: title,
        url: url
      }
    }
  });

  $newStoryForm.trigger("reset");
  hidePageComponents();
  getAndShowStoriesOnStart();
}

async function toggleFavorite(evt) {
  let $star = $(evt.target);
  let storyId = $star.closest('li').attr('id');
  let story = storyList.stories.find(s => s.storyId === storyId);
  console.log(storyId);
  await currentUser.toggleFavorite(story);
  $star.closest('i').toggleClass("fas far");
}

async function deleteStory(evt) {
  let $trash = $(evt.target);
  let storyId = $trash.closest('li').attr('id');
  await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "DELETE",
    data: {
      token: localStorage.getItem("token"),
    }
  });
  currentUser.ownStories = currentUser.ownStories.filter(s => s.storyId !== storyId);
  getAndShowStoriesOnStart();
}

$newStoryForm.on('submit', submitStory);
$('.stories-container').on('click', '.star', toggleFavorite);
$('.stories-container').on('click', '.trashCan', deleteStory);