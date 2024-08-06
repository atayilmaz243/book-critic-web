

function fetchAllBooks()
{
	fetch('http://localhost:3000/fetch-all-books')
	.then(response => response.json())
	.then(data => {


		document.querySelector('#loading').style.display = 'none'

		const explore_div = document.querySelector('#explore-books-div')
		for (const id in data)
		{
			const book = data[id]
		  	// const bookHTML = document.createElement('div');
		  	// bookHTML.id = id;
		  	// bookHTML.className = 'card mb-3';
		  	// bookHTML.style = 'max-width: 700px; width: 100%; cursor: pointer';
		  	// bookHTML.innerHTML = `
		    // <div class="row g-0">
		    //   <div class="col-md-4">
		    //     <img src="${book.front_img}" class="img-fluid rounded-start" style="width: 100%; height: 300px; object-fit:cover">
		    //   </div>
		    //   <div class="col-md-8">
		    //     <div class="card-body">
		    //       <h5 class="card-title">${book.title}</h5>
		    //       <p class="text-start text-secondary-emphasis">${book.author}</p>
		    //       <p class="card-text clamped-text">${book.description}</p>
		    //       <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
		    //     </div>
		    //   </div>
		    // </div>
		  	// `;

		  	const bookHTML = document.createElement('div');
			bookHTML.id = id;  // Use dynamic id
			bookHTML.className = 'mb-3 rounded';
			bookHTML.style = 'max-width: 700px; width: 700px; height: 200px; cursor: pointer; background: rgb(52,58,64);';
			bookHTML.innerHTML = `
			  <div class="row g-0" style="gap: 16px;">
			    <div style="width: 160px; height: 200px; display: flex; justify-content: flex-start; position: relative;">
			      <img src="${book.front_img}" class="img-fluid rounded-start" style="position: absolute; width: 100%; height: 100%;">
			    </div>
			    <div class="col-md-8" style="display: flex; flex-direction: column; gap: 5px;">
			      <div class="card-body" style="padding-top: 16px;">
			        <h5 class="card-title">${book.title}</h5>
			        <p class="text-start text-secondary-emphasis">${book.author}</p>
			        <p class="card-text clamped-text">${book.description}</p>
			        <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
			      </div>
			    </div>
			  </div>
			`;


			explore_div.appendChild(bookHTML);

			bookHTML.addEventListener('click',() => {
				  window.location.href = `http://localhost:3000/book?id=${id}`;
			})

		}

	})	
	.catch(error => {
		console.log(error)
	});
}

fetchAllBooks()