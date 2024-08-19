


document.addEventListener("DOMContentLoaded",async function() {


	const response = await fetch('/get-books-rating-order')

	if(response.ok)
	{
		const data = await response.json()

		const table = document.querySelector("#rating-table")

		const tbody = table.querySelector("tbody")

		let index = 1
		for (const id in data)
		{
			const book = data[id]

			const row = document.createElement('tr');
			row.style.verticalAlign = 'middle';
			row.style.cursor = 'pointer';

			row.innerHTML = `
			  <th scope="row">${index}</th>
			  <td>${book.rating}/5</td>
			  <td>
			    <div style="width: 80px; height: 120px;">
			      <img style="width: 100%; height: 100%;" src="${book.front_img}">
			    </div>
			  </td>
			  <td>${book.title}</td>
			  <td><p class = "clamped-text">${book.description}</p></td>
			`;

			tbody.appendChild(row)

			row.addEventListener('click',() => {
				window.location.href = `/book?id=${id}`
			})


			index++
		}


		document.querySelector("#loading").style.display = 'none'
		
	}
	else
	{
		console.error("Error fetching books by rating order.")
	}



})