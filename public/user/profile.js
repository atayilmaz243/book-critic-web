

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const profile_user = params.get('user');

async function editProfile() {
	const response = await fetch(`/getUsername`)
	const data = await response.json()

	if(data.username === profile_user)
	{
		document.querySelector(`#edit-profile-button`).style.display = 'block'

		document.getElementById('editProfileForm').addEventListener('submit', async function(e) {
		    e.preventDefault(); // Prevent the default form submission

		    const fileInput = document.getElementById('inputGroupFile04');
		    const file = fileInput.files[0];

			const formData = new FormData();

		    if (file)
		    {
		        formData.append('profilePicture', file);    	
		    }

		    const description = document.getElementById('exampleFormControlTextarea1').value;

			if (description)
			{
		        formData.append('description', description);
			}




		    if (description || file) {

		        try {
		            const response = await fetch('/editProfile', {
		                method: 'POST',
		                body: formData
		            });

		            // Handle the server response
		            const result = await response.json();

		            if (result.success) {
		                console.log('File uploaded successfully');
		                location.reload();

		            } else {
		                console.error('File upload failed:', result.message);
		            }

		        } catch (error) {
		            console.error('Error during fetch request:', error);
		        }
		    } else {
		        alert('Form is empty.');
		    }
		});

	}
}



async function userProfile() {

	const response = await fetch(`/getUserProfile?user=${profile_user}`)

	const data = await response.json()


	if (response.ok)
	{
		let numberOfFavorites = Object.keys(data.favorites).length;
		document.querySelector('#profile-username').innerHTML = `${data.username}`
		document.querySelector('#profile-description').innerHTML = `${data.description}`
		document.querySelector('#profile-count-favorites').innerHTML = `${numberOfFavorites}`

		loadProfilePicture(data.img)
		favoriteBooks(data.favorites)
	}
}

async function loadProfilePicture(img)
{
	if (!img)
	{
		return
	}


	const response = await fetch(`/image?path=${img}`)

	if (response.ok)
	{
        const blob = await response.blob();
        const imgURL = URL.createObjectURL(blob);
        document.getElementById('profile-picture').src = imgURL;
	}
}


async function favoriteBooks(books)
{


	const promises = books.map((book) => {
		return fetch(`/fetch-book?id=${book}`)
	});

	const results = await Promise.all(promises);

	const promises2 = results.map((data) => data.json())

	const data_arr = await Promise.all(promises2)

	const container = document.querySelector('#favorite-book-container')

	data_arr.forEach((data,index) => {
		container.innerHTML += `<div id='fav-${index}' class = "fav-book-img-container">
					<img style = "width: 100%; height: 100%; position: absolute;" src = "${data.front_img}">	
				</div>`;

	})

	books.forEach((book,index) => {
		document.querySelector(`#fav-${index}`).addEventListener('click',() => {
			window.location.href = `book?id=${books[index]}`
		})
	})


	if (books.length > 0)
	{
		document.querySelector('#favorite-book-display').style.display = 'flex'
	}

}


userProfile()
editProfile()