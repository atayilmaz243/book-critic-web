function fetchResults()
{
	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);
	const query = params.get('query');
	const by = params.get('by')

	let path = ""
	if (by) // if by is not null ,indicates user uses category section
	{
		path = `http://localhost:3000/search-category?query=${query}`
	}
	else
	{
		path = `http://localhost:3000/search?query=${query}`
	}

	fetch(path)
	.then(response => response.json())
	.then(results => {

		document.querySelector('#loading').style.display = 'none'

		
		const searchResults = document.querySelector('#search-results')

		const numberOfItems = Object.keys(results).length;
		const header = document.querySelector('#search-header')

		if (numberOfItems != 0)
		{
			if (by)
			{
				header.innerHTML = `${query}`
			}
			else
			{
				header.innerHTML = `"${query}" Search results`
			}
		}
		else
		{
			header.innerHTML = `"${query}" No results found`
		}


		for (const id in results){
			const book = results[id]
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
			      </div>
			    </div>
			  </div>
			`;


			searchResults.appendChild(bookHTML);

			bookHTML.addEventListener('click',() => {
				  window.location.href = `http://localhost:3000/book?id=${id}`;
			})
		}



	})	
	.catch(error => {
		console.log(error)
	});
}

fetchResults()