function fetchBestsellersBooks() {
	// let apiKey = "2S2xIryPnZ6hWb0XnN6SXQmaZWOa6XAa";
	let apiKey = "MpdaupkdGyB2PN3xSHUL9uw7WBZW5RAF";
	let url = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			if (data.results && data.results.books) {
				console.log(data);
				updateCarousel(data.results.books);
			}
		})
		.catch((error) => console.error("Error:", error));
}

//note  create and populate the carousel with api data
function updateCarousel(books) {
	let carouselContainer = $("#carouselExample .carousel-inner");
	carouselContainer.empty();

	books.forEach((book, index) => {
		let isActive = index === 0 ? "active" : "";

		//note Create the card
		let cardBody = $("<div>").addClass("card-body");
		let titleElement = $("<h5>").addClass("card-title").text(book.title);
		let descriptionElement = $("<p>")
			.addClass("card-text")
			.text(book.description);
		//note add modal to card displaying extra info
		let modalTriggerButton = $("<button>")
			.addClass("btn btn-primary d-block mx-auto")
			.attr("data-bs-toggle", "modal")
			.attr("data-bs-target", "#bookModal")
			.css({
				"margin-top": "20px",
				"background-color": "#AFC8AD",
				"border-color": "#AFC8AD",
			})
			.text("More Details")
			.click(function () {
				$("#bookModalLabel").html(book.title);
				$("#bookModal #bookImage").attr("src", book.book_image);
				$("#bookModal #bookAuthor").html(
					"<strong>Author</strong>: " + book.author
				);
				$("#bookModal #bookTitle").html(
					"<strong>Title</strong>: " + book.title
				);
				$("#bookModal #rank").html(
					"<strong>Bestseller Rank</strong>: " + book.rank
				);
				$("#bookModal #weeksOnList").html(
					"<strong>Weeks on Bestseller List</strong>: " + book.weeks_on_list
				);
				$("#bookModal #bookDescription").html(
					"<strong>Description</strong>: " + book.description
				);
			});

		cardBody.append(titleElement, descriptionElement, modalTriggerButton);

		//note Creating card with custom styles
		let card = $("<div>")
			.addClass("card custom-book-card")
			.css({
				"border-radius": "8%",
				"background-color": "#FFFAF4",
				"box-shadow": "0px 0px 10px rgba(0, 0, 0, 0.1)",
				"margin-top": "40px",
				"margin-bottom": "40px",
				"min-height": "450px",
			})
			.append(cardBody);

		//note Creating the carousel item
		let carouselItem = $("<div>").addClass(`carousel-item ${isActive}`);
		let carouselRow = $("<div>").addClass("row align-items-center g-0");

		//note Creating carousel image section
		let imgElement = $("<img>")
			.addClass("card-img-top col-md-6")
			.attr("src", book.book_image)
			.attr("alt", book.title)
			.css({ "max-height": "500px", "object-fit": "contain" });

		//note Appending image and card to display in row
		carouselRow.append(imgElement);
		carouselRow.append($("<div>").addClass("col-md-6").append(card));
		carouselItem.append(carouselRow);

		carouselContainer.append(carouselItem);
	});
}

//note fetching the bestsellers on page load
$(document).ready(function () {
	fetchBestsellersBooks();
});
//note DISPLAYING CURRENT YEAR VIA DATE.js
function updateCurrentYear() {
	$("#current-year").text(new Date().getFullYear());
}
