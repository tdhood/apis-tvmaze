"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm($searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await axios.get("https://api.tvmaze.com/singlesearch/shows", {
    params: { q: $searchTerm },
  });
  const id = response.data.id;
  const name = response.data.name;
  const summary = response.data.summary;
  const image =
    response.data.image ||
    "https://m.media-amazon.com/images/I/61WJ-qHBlEL._AC_SS450_.jpg";

  return [
    {
      id: id,
      name: name,
      summary: summary,
      image: image,
    },
  ];
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
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
  let formattedEpisodes = [];
  for(let episode of episodes) {
    const id = episode.id;
    const name = episode.name;
    const season = episode.season;
    const number = episode.number;

    formattedEpisodes.push({id, name, season, number});
  }

  return formattedEpisodes;
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
