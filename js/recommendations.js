document.addEventListener("DOMContentLoaded", function () {
	$("#getRecommendationsBtn").click(function (event) {
		event.preventDefault();

		const genre = $("#genreSelect").val();
		const recommendationsDiv = $("#recommendations");

		//note Check if a genre is selected, other modal
		if (genre) {
			fetchBooksBatch(genre, 0)
				.then((allBooks) => getRandomBooks(allBooks, 20))
				.then((randomBooks) =>
					displayRecommendations(randomBooks, recommendationsDiv)
				);
			$("#genreSelect").val("");
		} else {
			new bootstrap.Modal(
				document.getElementById("noGenreSelectedModal")
			).show();
		}
	});
});

function fetchBooksBatch(genre, startIndex, allBooks = []) {
	const maxResults = 40;
	const queryURL = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&startIndex=${startIndex}&maxResults=${maxResults}`;

	return fetch(queryURL)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			allBooks = allBooks.concat(data.items || []);
			if (
				allBooks.length < 152 &&
				data.items &&
				data.items.length === maxResults
			) {
				return fetchBooksBatch(genre, startIndex + maxResults, allBooks);
			}
			return allBooks;
		});
}

function getRandomBooks(books, count) {
	const shuffled = books.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function displayRecommendations(books, container) {
	container.empty();
	const bookCards = books.map(createBookCard).filter((card) => card !== null);
	appendBookRow(bookCards, container);
}

function createBookCard(item) {
	if (!item.volumeInfo) return null;

	let title = item.volumeInfo.title || "No title available";
	let author = item.volumeInfo.authors
		? item.volumeInfo.authors.join(", ")
		: "Unknown author(s)";
	let rating = item.volumeInfo.averageRating
		? item.volumeInfo.averageRating
		: "No rating available";
	let releaseDate = item.volumeInfo.publishedDate
		? item.volumeInfo.publishedDate
		: "No published date available";
	let pageCount = item.volumeInfo.pageCount
		? item.volumeInfo.pageCount
		: "No page count available";
	let publisher = item.volumeInfo.publisher
		? item.volumeInfo.publisher
		: "No publisher available";
	let category = item.volumeInfo.categories
		? item.volumeInfo.categories
		: "No category available";
	let description = item.volumeInfo.description
		? item.volumeInfo.description
		: "No description available";
	let thumbnail = item.volumeInfo.imageLinks
		? item.volumeInfo.imageLinks.smallThumbnail
		: "path_to_default_image.jpg";

	let card = $("<div>").addClass("card d-flex  border border").css({
		"border-radius": "8%",
		"background-color": "#FFFAF4",
		"box-shadow": "0px 0px 10px rgba(0, 0, 0, 0.1)",
		"margin-top": "40px",
		"margin-bottom": "40px",
		"min-height": "450px",
		display: "flex",
		"flex-direction": "column",
		"justify-content": "space-between",
	});
	let imgElement = $("<img>")
		.addClass("card-img-top")
		.attr("src", thumbnail)
		.attr("alt", title)
		.css({ "max-height": "350px", "object-fit": "contain" });
	let cardBody = $("<div>").addClass("card-body");
	let titleElement = $("<h5>").addClass("card-title text-center").text(title);
	let modalTriggerButton = $("<button>")
		.addClass("btn btn-primary d-block mx-auto ")
		.attr("data-bs-toggle", "modal")
		.attr("data-bs-target", "#bookModal")
		.css({
			"margin-top": "20px",
			"background-color": "#AFC8AD",
			"border-color": "#AFC8AD",
		})
		.text("More Details")
		.click(function () {
			$("#bookModalLabel").html(title);
			$("#bookModal #bookAuthor").html("<strong>Author</strong>: " + author);
			$("#bookModal #pageCount").html(
				"<strong>Page Count</strong>: " + pageCount
			);
			$("#bookModal #publisher").html(
				"<strong>Publisher</strong>: " + publisher
			);
			$("#bookModal #category").html("<strong>Category</strong>: " + category);
			$("#bookModal #releaseDate").html(
				"<strong>Release Date</strong>: " + releaseDate
			);
			$("#bookModal #bookDescription").html(
				"<strong>Description</strong>: " + description
			);
			$("#bookModal #bookRating").html("<strong>Rating</strong>: " + rating);
			$("#bookModal #bookImage").attr("src", thumbnail);
		});

	cardBody.append(titleElement, imgElement, modalTriggerButton);
	card.append(cardBody);

	return $("<div>").addClass("col-md-4 p-3").append(card);
}
function appendBookRow(bookCards, container) {
	let currentRow = $("<div>").addClass("row");
	bookCards.forEach((card, index) => {
		currentRow.append(card);

		if ((index + 1) % 3 === 0) {
			container.append(currentRow);
			currentRow = $("<div>").addClass("row");
		}
	});

	if (currentRow.children().length > 0) {
		container.append(currentRow);
	}
}

const bookCards = data.items
	.map(createBookCard)
	.filter((card) => card !== null);
appendBookRow(bookCards, $("#book-recommendations"));
