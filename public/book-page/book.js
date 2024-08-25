

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const id = params.get('id');

let user = {username:undefined}

async function fetchUser()
{


    const response = await fetch('/getUser');
    user = await response.json();


		getComments()
    addFavorite()
    updateRating()
}



function fetchBook()
{

	fetch(`/fetch-book?id=${id}`)
	.then(response => response.json())
	.then(book => {

		document.querySelector('#loading').style.display = 'none'

		
		document.querySelector("#book-img").src = book.front_img
		document.querySelector("#author").innerHTML = book.author
		document.querySelector("#book-name").innerHTML = book.title
		document.querySelector("#description").innerHTML = book.description	
		document.querySelector("#book-rating").innerHTML = `${book.rating}/5`

		const background = document.querySelector("#background").src = book.front_img

	})	
	.catch(error => {
		console.log(error)
	});
}

async function makeComment()
{
	document.querySelector('#send-comment').addEventListener('click',async () => {

		if (!user.username)
		{
			window.location.href = '/login'
			return
		}



		try {
			const comment = document.querySelector('#exampleFormControlTextarea1').value

			const response = await fetch('/comment', {
		 	 	method: 'POST',
		      	headers: {
		        	'Content-Type': 'application/json'
		      	},
		      	body: JSON.stringify({id,comment})
		    });

		    if (response.ok)
		    {

		    	const comment_data = await response.json()

		    	document.querySelector('#offcanvas-close-btn').click()

		    	const box = document.querySelector('#comment-box')

				const outerDiv = document.createElement('div');

				outerDiv.style.display = "flex";
				outerDiv.style.paddingLeft = "16px";
				outerDiv.style.paddingTop = "10px";
				outerDiv.style.gap = "16px";
				outerDiv.style.position = "relative";
				outerDiv.className = "bg-body-secondary rounded";

				outerDiv.innerHTML = `
				    <div style="display:flex; gap:12px;">
				        <img src="https://storage.googleapis.com/book-critic-app/unknown-user.jpg" style="width:40px;height:40px; border-radius:20px; object-fit:cover">
				    </div>
				    <div class = 'comment-body' style="display:flex; flex-direction:column">
				        <h6 style="margin:0;text-decoration-line: underline; cursor:pointer">${user.username}</h6>
				        <p style="" class=""><small>${comment}</small></p>
				    </div>
				    <p class="text-start text-secondary-emphasis" style="margin:0; position:absolute; top:4px; right:10px;"><small>0 minutes ago</small></p>
				`;

					box.insertBefore(outerDiv, box.firstChild);

		    	loadProfilePicture({username:user.username,div: outerDiv})


		    	outerDiv.querySelector('h6').addEventListener('click',() => {
						window.location.href = `/profile?user=${user.username}`
					})
					const buttonDelete = document.createElement('div');
					buttonDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"> <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg>`
					buttonDelete.style.cssText = `position:absolute; width:20px; height:20px; bottom:8px; right:0px; cursor:pointer`
					outerDiv.querySelector('.comment-body').appendChild(buttonDelete)


					buttonDelete.addEventListener('click', async () => {
					    const response = await fetch('/delete-comment', {
					      method: 'POST',
					      headers: {
					        'Content-Type': 'application/json'
					      },
					      body: JSON.stringify({id:comment_data.comment_id})
					    });

					    if (response.ok)
					    {
					    	box.removeChild(outerDiv)
					    }
					    else
					    {
					    	console.error("Error deleting comment.")
					    }
					})

		    }
		    else
		    {
		    	const err = await response.json()
		    	console.error(`Error commenting: ${err.message}`)
		    }
		} catch(error) {
			   console.error('Error fetching data:', error);
		}


	});

}

function addFavorite()
{
	let favorite = user.username ? (user.favorites && user.favorites.includes(id)) : false


	const button = document.querySelector('#favorite-button')
	const span = button.querySelector('span')
	const svg_heart1 = button.querySelector('#svg-first')
	const svg_heart2 = button.querySelector('#svg-second')

	if (favorite)
	{
		span.innerHTML = 'Remove from favorite'
		svg_heart1.style.display = 'none'
		svg_heart2.style.display = 'block'
	}
	else
	{
		span.innerHTML = 'Add to favorite'
		svg_heart1.style.display = 'block'
		svg_heart2.style.display = 'none'
	}

	
	button.addEventListener('click',async () => {

		if (!user.username)
		{
			window.location.href = `/login`
			return
		}



		
		if (favorite)
		{
			const response = fetch('/remove-favorite', {
	     	 	method: 'POST',
		      	headers: {
		        	'Content-Type': 'application/json'
		      	},
		      	body: JSON.stringify({id})
		    });
			span.innerHTML = 'Add to favorite'
			svg_heart1.style.display = 'block'
			svg_heart2.style.display = 'none'

		}
		else
		{
			const response = fetch('/add-favorite', {
	     	 	method: 'POST',
		      	headers: {
		        	'Content-Type': 'application/json'
		      	},
		      	body: JSON.stringify({id})
		    });
			span.innerHTML = 'Remove from favorite'
			svg_heart1.style.display = 'none'
			svg_heart2.style.display = 'block'

		}

		favorite = !favorite

	})
}


async function loadProfilePicture({username,div})
{

	const snapshot = await fetch(`/getUserProfile?user=${username}`)

	const user_data = await snapshot.json()

	if ((!user_data) || (!user_data.img))
	{
		return null
	}

	const response = await fetch(`/image?path=${user_data.img}`)


	if (response.ok)
	{
        const blob = await response.blob();
        const imgURL = URL.createObjectURL(blob);

        div.querySelector('img').src = imgURL

	}
	return null
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

async function getComments() {

	const response = await fetch(`/getComments?id=${id}`)



	const data = await response.json()

	const commentBox = document.querySelector('#comment-box')
	for (const id in data)
	{
		const comment = data[id]
		// commentBox.innerHTML += `<div id = '${id}' style = "display:flex; padding-left:16px; padding-top: 10px; gap:16px; position:relative" class = 'bg-body-secondary rounded'>
		// 				<div style = "display:flex ;gap:12px;">
		// 					<img src = "https://storage.googleapis.com/book-critic-app/unknown-user.jpg" style = "width:40px;height:40px; border-radius:20px ; object-fit:cover">
		// 				</div>
		// 				<div style = "display:flex ; flex-direction:column">
		// 					<h6 style = "margin:0">${comment.user}</h6>
		// 					${ comment.date ?  ('<p class="text-start text-secondary-emphasis" style = "margin:0; position:absolute ; top:4px; right:10px "><small>' + formatTime(comment.date)+ '</small></p>') : ''}
		// 					<p style = "" class = ''><small>${comment.comment}</small></p>
		// 				</div>
		// 			</div>`



		const outerDiv = document.createElement('div');
		outerDiv.id = id;
		outerDiv.style.display = "flex";
		outerDiv.style.paddingLeft = "16px";
		outerDiv.style.paddingTop = "10px";
		// outerDiv.style.minHeight = "60px"
		outerDiv.style.gap = "16px";
		outerDiv.style.position = "relative";
		outerDiv.className = "bg-body-secondary rounded";

		outerDiv.innerHTML = `
		    <div style="display:flex; gap:12px;">
		        <img  class = "comment-user-img" src="https://storage.googleapis.com/book-critic-app/unknown-user.jpg" >
		    </div>
		    <div class = "comment-body" style="display:flex; flex-direction:column">
		        <h6 style="margin:0;text-decoration-line: underline; cursor:pointer">${comment.user}</h6>
		        ${comment.date ? ('<p class="text-start text-secondary-emphasis" style="margin:0; position:absolute; top:4px; right:10px;"><small>' + formatTime(comment.date) + '</small></p>') : ''}
		        <p style="" class=""><small>${comment.comment}</small></p>
		    </div>
		`;

		commentBox.appendChild(outerDiv);
		loadProfilePicture({div:outerDiv,username: data[id].user})

		if (user.username === comment.user)
		{
				const buttonDelete = document.createElement('div');
				buttonDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"> <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg>`
				buttonDelete.style.cssText = `position:absolute; width:20px; height:20px; bottom:8px; right:0px; cursor:pointer`
				outerDiv.querySelector('.comment-body').appendChild(buttonDelete)


				buttonDelete.addEventListener('click', async () => {
				    const response = await fetch('/delete-comment', {
				      method: 'POST',
				      headers: {
				        'Content-Type': 'application/json'
				      },
				      body: JSON.stringify({id})
				    });

				    if (response.ok)
				    {
				    	commentBox.removeChild(outerDiv)
				    }
				    else
				    {
				    	console.error("Error deleting comment.")
				    }
				})
		}



		outerDiv.querySelector('h6').addEventListener('click',() => {
			window.location.href = `/profile?user=${comment.user}`
		})



	}

}

async function updateRating() {

	const starRating = document.querySelector('.star-rating');

	if (user.username)
	{
		const snapshot = await fetch(`/getUserRating?id=${id}`)
		const data = await snapshot.json()
		if (data)
			starRating.querySelector(`input[value="${data.rating}"]`).checked = true
	}


    starRating.addEventListener('change', async function(event) {
        if (event.target.name === 'rating') {

			if (!user.username)
			{
				window.location.href = `/login`
				event.target.checked = false
				return
			}

 			const snapshot = await fetch('/updateRating', {
	     	 	method: 'POST',
		      	headers: {
		        	'Content-Type': 'application/json'
		      	},
		      	body: JSON.stringify({point: event.target.value, bookId : id})
		    });

 			const response = await snapshot.json()

 			document.querySelector("#book-rating").innerHTML = `${response.new_rating}/5`
        }
    });


}

fetchBook()
fetchUser()
makeComment()
