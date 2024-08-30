


const formatTime = (timestampObj) => {
  // Convert the Firestore timestamp object into a JavaScript Date object
  const timestampInMilliseconds = timestampObj._seconds * 1000 + timestampObj._nanoseconds / 1000000;
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


function fetchAllBooks()
{
	fetch('/fetch-all-books')
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
			bookHTML.className = 'mb-3 card-book';
			// bookHTML.style = 'width: 700px; height: 200px; cursor: pointer; background: rgb(52,58,64); padding-left:20px ; padding-right:20px; gap: 16px; display: flex ; align-items:center; position:relative';
			bookHTML.innerHTML = `
			    <div class = 'card-book-img-container' >
			      <img src="${book.front_img}" style="position: absolute; width: 100%; height: 100%;">
			      <div style = "z-index: 20; padding-left:5px; padding-right:5px; position: absolute; background: rgba(0, 0, 0, 0.5); bottom:0px; left:0px">${book.rating}/5</div>
			    </div>
			    <div style="display: flex; flex-direction: column; gap: 5px; width: 540px; height:200px">
			      <div style="padding-top: 16px;">
			        <h5 class = "card-book-title">${book.title}</h5>
			        <p class="text-secondary-emphasis card-book-author">${book.author}</p>
			        <p class="clamped-text card-book-description">${book.description}</p>
			        <p style = "position: absolute ; bottom:0px; right:16px;" class = "card-book-date"><small class="text-body-secondary">${formatTime(book.creation)}</small></p>
			      </div>
			    </div>
			`;


			explore_div.appendChild(bookHTML);

			bookHTML.addEventListener('click',() => {
				  window.location.href = `/book?id=${id}`;
			})

		}

	})	
	.catch(error => {
		console.log(error)
	});
}

fetchAllBooks()