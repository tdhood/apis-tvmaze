"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TV_MAZE_SEARCH_API = "https://api.tvmaze.com/search/shows";
const MISSING_PIC_URL = "https://m.media-amazon.com/images/I/61WJ-qHBlEL._AC_SS450_.jpg"


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm($searchTerm) {
  const response = await axios.get(TV_MAZE_SEARCH_API, {
    params: { q: $searchTerm },
  });

  const shows = response.data;

  const showList = shows.map(show => ({
    id : show.show.id,
    name : show.show.name,
    summary : show.show.summary,
    image : (show.show.image ? show.show.image.medium : MISSING_PIC_URL
    )
  }));

  return showList;
}

/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button  class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = response.data;
  const formattedEpisodes = episodes.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));

  return formattedEpisodes;
}

/** Takes in an array of episode objects, empties the episodesArea creates html for episodes,
 *  and appends to the #episodesList
 */

function populateEpisodes(episodes) { 
  $("#episodesList").empty();

  for (let episode of episodes) {
    const $episode = $(
      `<li id="${episode.id}">Name: ${episode.name}, 
      Season: ${episode.season}, Episode Number: ${episode.number}</>`
    );
    console.log($episode);
    $("#episodesList").append($episode);
  }
}

$("#showsList").on("click", ".Show-getEpisodes", async function (evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
  $episodesArea.show();
});

$episodesArea.on("click", async function (evt) {
  evt.preventDefault();
  //const id = $showsList.id()
  await searchForShowAndDisplay();
});
