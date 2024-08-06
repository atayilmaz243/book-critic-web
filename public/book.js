


function fetchBook()
{
	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);
	const id = params.get('id');
	fetch(`http://localhost:3000/fetch-book?id=${id}`)
	.then(response => response.json())
	.then(book => {

		document.querySelector('#loading').style.display = 'none'

		
		document.querySelector("#book-img").src = book.front_img
		document.querySelector("#author").innerHTML = book.author
		document.querySelector("#book-name").innerHTML = book.title
		document.querySelector("#description").innerHTML = book.description	
	})	
	.catch(error => {
		console.log(error)
	});
}

fetchBook()