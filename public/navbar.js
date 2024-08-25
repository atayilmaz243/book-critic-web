



document.addEventListener("DOMContentLoaded",function() {


	const style = document.createElement('style');
	style.innerHTML = `
	    .autocomplete-item:hover {
	        background-color: rgb(108,117,125);
	    }
	`;

	document.head.appendChild(style);

	fetch('/getUsername')
	.then(response => response.json())
	.then(async user => {
		if (user.username)
		{
			document.querySelector('#not-logged').style.display = 'none'
			document.querySelector('#nav-username').innerHTML = user.username
			document.querySelector('#logged').style.display = 'block'
			document.querySelector('#nav-profile').href = `/profile?user=${user.username}`

			document.querySelector('#logout-button').addEventListener('click',async () => {


			const response = await fetch('/logout', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json'
		      }
		    });

			if (response.ok)
			{

				document.querySelector('#not-logged').style.display = 'block'
				document.querySelector('#logged').style.display = 'none'
			}
			else
			{
				console.log('Logout failed.')
			}


			})
		}
	})
	.catch(error => {
		console.log(error)
	});


    var searchInput = document.getElementById("nav-search-bar");
    var autocompleteList = document.getElementById("autocomplete-list");

    searchInput.addEventListener("keydown", function(event) {
    	if (event.key === 'Enter')
    	{
    		event.preventDefault();
    		// console.log('aa')
    		window.location.href = `/search-results?query=${this.value}`;
    	}
    })
    searchInput.addEventListener("input", function() {


        fetch(`/search?query=${this.value}`)
        .then(response => response.json())
        .then(data => {

	        autocompleteList.innerHTML = "";

	        for (const id in data){
	        	const doc = data[id]
	            var item = document.createElement("div");
	            item.classList.add("autocomplete-item");
	            item.innerText = doc.title

				item.style.cssText = 'padding-left: 15px; padding-right: 15px; padding-top:10px; padding-bottom:10px; cursor: pointer;';


	            // Add click event to autocomplete item
	            item.addEventListener("click", function() {

	                window.location.href = `/book?id=${id}`
	                autocompleteList.innerHTML = "";
	            });


	            autocompleteList.appendChild(item);
	        }
        }).catch(error => {console.log(error)});

    });

    // Close the autocomplete list when clicking outside
    document.addEventListener("click", function(e) {
        if (e.target !== searchInput) {
            autocompleteList.innerHTML = "";
        }
    });





});



