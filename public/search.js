




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
			bookHTML.className = 'mb-3';
			bookHTML.style = 'width: 700px; height: 200px; cursor: pointer; background: rgb(52,58,64); padding-left:20px ; padding-right:20px; gap: 16px; display: flex ; align-items:center; position:relative';
			bookHTML.innerHTML = `
			    <div style="width: 120px; height: 180px; display: flex; justify-content: flex-start; position: relative;">
			      <img src="${book.front_img}" style="position: absolute; width: 100%; height: 100%;">
			      <div style = "z-index: 20; padding-left:5px; padding-right:5px; position: absolute; background: rgba(0, 0, 0, 0.5); bottom:0px; left:0px">${book.rating}/5</div>
			    </div>
			    <div style="display: flex; flex-direction: column; gap: 5px; width: 540px; height:200px">
			      <div style="padding-top: 16px;">
			        <h5>${book.title}</h5>
			        <p class="text-secondary-emphasis">${book.author}</p>
			        <p class="clamped-text">${book.description}</p>
			        <p style = "position: absolute ; bottom:0px; right:16px"><small class="text-body-secondary">${formatTime(book.creation)}</small></p>
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

const formatTime = (timestampObj) => {
  // Convert the Firestore timestamp object into a JavaScript Date object
  const timestampInMilliseconds = timestampObj.seconds * 1000 + timestampObj.nanoseconds / 1000000;
  const timestampDate = new Date(timestampInMilliseconds);

  const currentTime = new Date();
  const timeDifference = currentTime - timestampDate; // Time difference in milliseconds
  const secondsDifference = timeDifference / 1000;
  const minutesDifference = secondsDifference / 60;
  const hoursDifference = minutesDifference / 60;
  const daysDifference = hoursDifference / 24;

  if (minutesDifference < 60) {
    return `${Math.floor(minutesDifference)} minutes ago`;
  } else if (hoursDifference < 24) {
    return `${Math.floor(hoursDifference)} hours ago`;
  } else if (daysDifference < 7) {
    return `${Math.floor(daysDifference)} days ago`;
  } else {
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return timestampDate.toLocaleDateString('en-US', dateOptions);
  }
};


fetchResults()